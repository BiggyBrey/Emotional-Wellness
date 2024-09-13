// import Chart from 'chart.js/auto'
import { useLoaderData } from "react-router-dom";
import { requireAuth } from "./services/UserAuth";
import { getAiChatById } from "./services/openAiApi";
import PolarAreaChart from "./components/MoodMetricsChart/PolarAreaChart";
// import "./components/NEW-Dashboard/DashPageStyles"

export async function loader() {
  await requireAuth();
  const response = await getAiChatById(
    JSON.parse(localStorage.getItem("userID"))
  );
  return response.data;
}
function MoodMetrics() {
  const loader = useLoaderData();
 
  let moods = loader.conversations.map(convo=> convo.mood)
 
  return (
    <>
      <PolarAreaChart
      moods ={moods}
      />
    </>
  );
}
export default MoodMetrics;
