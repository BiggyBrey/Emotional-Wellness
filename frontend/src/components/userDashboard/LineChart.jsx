import React from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday","Sunday"];
const data = {
  labels: labels,
  datasets: [
    {
      label: "My Mood Over Time",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: [2, 5, 10, 2, 20, 30,10],
    },
  ],
};
const LineChart = () => {
  return (
    <div>
      <Line data={data} />
    </div>
  );
};
export default LineChart;
