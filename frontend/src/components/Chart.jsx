/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import SocketWrapper from "./SocketWrapper";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const daysForChart = [
  {
    label: "24 Hours",
    value: 1,
  },
  {
    label: "30 Days",
    value: 30,
  },
  {
    label: "3 Months",
    value: 90,
  },
  {
    label: "1 Year",
    value: 365,
  },
];

const Chart = ({ coinId }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [days, setDays] = useState(1);

  // Calculate 'fromTime' using default value
  const [fromTime, setFromTime] = useState(getFromTime());

  const [currentPrice, setCurrentPrice] = useState(0);

  // Function to fetch historical data from the server
  const fetchHistoricalData = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3030/crypto/${coinId}/history?from=${fromTime}&to=${Date.now()}`
      );
      setHistoricalData(data.data);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  }, [coinId, fromTime]);

  useEffect(() => {
    // Update 'fromTime' when 'days' changes
    setFromTime(getFromTime(days));
  }, [days]);

  useEffect(() => {
    try {
      // Fetch historical data when 'fromTime' or 'coinId' changes
      fetchHistoricalData();
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  }, [fromTime, fetchHistoricalData]);

  // Function to handle live price updates
  const handleLiveRequest = useCallback(
    (data) => {
      try {
        console.log(
          days,
          coinId,
          data.currencyId,
          coinId === data.currencyId,
          "handleLiveRequest"
        );
        if (data.currencyId === coinId) {
          setCurrentPrice(data.data.price);
        }
      } catch (error) {
        console.error("Error handling live request:", error);
      }
    },
    [coinId, days]
  );

  // Function to handle per interval price updates
  const handlePerIntervalRequest = useCallback(
    (data) => {
      try {
        if (days === 1 && data.currencyId === coinId) {
          setHistoricalData((prev) => [...prev, data.data]);
        }
        setCurrentPrice(data.data.price);
      } catch (error) {
        console.error("Error handling per interval request:", error);
      }
    },
    [coinId, days]
  );

  // Function to calculate 'fromTime' based on selected number of days
  function getFromTime(days = 1) {
    return Math.floor(Date.now() - days * 24 * 60 * 60 * 1000);
  }

  return (
    <div
      id={coinId}
      style={{
        border: "1px solid #EEBC1D",
        borderRadius: "10px",
        marginTop: "1rem",
        padding: "1rem",
      }}
    >
      <div style={{ marginY: "150px" }}>
        {coinId.toUpperCase()} ${parseFloat(currentPrice).toFixed(2)}
      </div>
      <div style={{ width: "900px", height: "420px" }}>
        <Line
          data={{
            labels: historicalData.map((coin) => {
              try {
                let date = new Date(coin?.timestamp);
                let time = `${date.getHours()}:${date.getMinutes()}`;
                return days === 1 ? time : date.toLocaleDateString();
              } catch (error) {
                console.error("Error formatting date:", error);
                return "";
              }
            }),

            datasets: [
              {
                data: historicalData.map((coin) => coin.price),
                label: `Price ( Past ${days} Days ) in ${"USD"}`,
                borderColor: "#EEBC1D",
              },
            ],
          }}
          options={{
            elements: {
              point: {
                radius: 1,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },

            animation: {
              duration: 0,
            },
            scales: {
              x: {
                display: false,
              },
            },
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        {daysForChart.map((day) => (
          <button
            key={day.value}
            onClick={() => {
              setDays(day.value);
            }}
            style={{
              background: day.value === days ? "blue" : undefined,
            }}
          >
            {day.label}
          </button>
        ))}
      </div>
      {/* Using SocketWrapper to manage the socket connection */}
      <SocketWrapper
        coinId={coinId}
        days={days}
        handleLiveRequest={handleLiveRequest}
        handlePerMinuteRequest={handlePerIntervalRequest}
      />
    </div>
  );
};

export default Chart;
