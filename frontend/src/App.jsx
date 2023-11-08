import "./App.css";
import Chart from "./components/Chart";
function App() {
  return (
    <>
      <Chart key={"bitcoin"} coinId={"bitcoin"} />
      <Chart key={"solana"} coinId={"solana"} />
      <Chart key={"ethereum"} coinId={"ethereum"} />
    </>
  );
}

export default App;
