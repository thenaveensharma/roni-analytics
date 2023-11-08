const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: true });
const cors = require("cors");
const config = require("./config/config");
require("./config/db");
const { PORT } = config[process.env.NODE_ENV];
const currency = require("./routes/currency");
const price = require("./routes/price");
require("./utils/associations");

// for fetching real time price information
const { WebsocketStream } = require("@binance/connector");
const { Console } = require("console");
const Price = require("./models/price");
const Currency = require("./models/currency");

app.use(express.json());

// Define allowed origins for CORS
const allowedOrigins = ["http://localhost:5173"];
app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204 || 200,
  })
);
app.get("/", (req, res) => {
  res.status(200).send("Server is up");
});

// Routes for handling currency and price related requests
app.use("/currency", currency);
app.use("/crypto", price);

// to fetch the real time price of currencies
const logger = new Console({ stdout: process.stdout, stderr: process.stderr });

// storing last request time for each currency
const lastRequestTime = {};

// Websocket event handling callbacks
const callbacks = {
  open: () => logger.debug("Connected with Websocket server"),
  close: () => logger.debug("Disconnected with Websocket server"),
  message: async (data) => {
    try {
      const currencyData = JSON.parse(data);
      const { s: binanceSymbol, p: price, T: timestamp } = currencyData;
      const { dataValues: currency } = await Currency.findOne({
        where: { binanceSymbol: binanceSymbol.toLowerCase() },
      });
      // emit every price change event
      io.to(currency.symbol).emit("price", {
        currencyId: currency.symbol,
        data: { timestamp, price },
      });
      // save and emit price per minute only
      const now = Date.now();
      const lastTime = lastRequestTime[currency] || 0;
      const timeSinceLastRequest = now - lastTime;

      if (timeSinceLastRequest >= 1000) {
        lastRequestTime[currency] = now;
        // saving to database
        const { dataValues: savedPrice } = await Price.create({
          currencyId: currency.symbol,
          timestamp: timestamp,
          value: price,
        });
        io.to(savedPrice.currencyId).emit("price:interval", {
          currencyId: savedPrice.currencyId,
          data: { timestamp, price },
        });
      } else {
        // console.log(
        //   `Request rate for ${currency.symbol} exceeded. Skipping request.`
        // );
      }
    } catch (error) {
      console.log(error);
    }
  },
};

const websocketStreamClient = new WebsocketStream({ logger, callbacks });

// Subscribe to specific cryptocurrencies for price updates
websocketStreamClient.aggTrade("ethusdt", callbacks);
websocketStreamClient.aggTrade("btcusdt", callbacks);
websocketStreamClient.aggTrade("solusdt", callbacks);

// close websocket stream
// setTimeout(() => websocketStreamClient.disconnect(), 10000);

// Handle websocket connections
io.on("connection", (socket) => {
  // Emit a 'connected' event when a client connects
  socket.emit("connnected", "connected");

  // Handle setup and room joining
  socket.on("setup", (coinId) => {
    socket.join(coinId);
    socket.emit("connected");
  });
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
