import { useState, useEffect } from "react";
import "./App.css";
import { useLoaderData } from "react-router-dom";
import { getUserById } from "./services/api";
import { requireAuth, useUserAuth } from "./services/UserAuth";
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

export async function loader() {
  await requireAuth()
  const response = await getUserById(JSON.parse(localStorage.getItem("userID")))
  return response.data
}
function Dashboard() {
  const [chartData, setChartData] = useState([...Data]);
  const user = useLoaderData()
  const { login } = useUserAuth(); // Access the login function from context

  //on laod save user to use context
  useEffect(() => {
    if (user) {
      login(user);
    }
  }, []);
  return (
    <>
      <h1 className="text-5xl">Welcome {user.username}!</h1>
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
