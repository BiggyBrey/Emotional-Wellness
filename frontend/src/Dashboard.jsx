import { useState } from "react";
import "./App.css";
import Footer from "./components/userDashboard/Footer";
import JournalCard from "./components/userDashboard/JournalsCard";
import Graph1 from "./components/userDashboard/Graph1";

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import "./components/userDashboard/Dashboard.css"
import { Data } from "./utils/Data";
import LineChart from "./components/userDashboard/LineChart";
import Chatbot from "./components/userDashboard/ChatbotCard";
// import "./styles.css";

function Dashboard() {
  const [chartData, setChartData] = useState([...Data]);

  return (
    <>
      <div className="midRow">
        <JournalCard />
        <Graph1>
          <LineChart />
        </Graph1>
      </div>

    </>
  );
}

export default Dashboard;
