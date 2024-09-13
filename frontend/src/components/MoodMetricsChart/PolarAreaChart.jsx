import React, { useState, useEffect } from "react";
import { PolarArea } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import "chartjs-adapter-moment"; // for time filtering

Chart.register(ArcElement, Tooltip, Legend);

const PolarAreaChart = () => {
  
  const data = {
    labels: ["Red", "Green", "Yellow", "Grey", "Blue"],
    datasets: [
      {
        label: "My First Dataset",
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(255, 205, 86)",
          "rgb(201, 203, 207)",
          "rgb(54, 162, 235)",
        ],
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensures it fits properly
  };

  return (
    <>
      <div className="w-full h-screen">
        <PolarArea data={data} options={options} />
      </div>
    </>
    // <div className="container mx-auto">
    //   <h1 className="text-2xl font-bold mb-4">Emoji Polar Area Chart</h1>

    //   {/* Emoji Input Form */}
    //   <div className="mb-4">
    //     <input
    //       type="text"
    //       placeholder="Emoji"
    //       className="border p-2 mr-2"
    //       value={emoji}
    //       onChange={(e) => setEmoji(e.target.value)}
    //     />
    //     <input
    //       type="date"
    //       className="border p-2 mr-2"
    //       value={date}
    //       onChange={(e) => setDate(e.target.value)}
    //     />
    //     <button
    //       onClick={handleAddEmoji}
    //       className="bg-blue-500 text-white px-4 py-2 rounded"
    //     >
    //       Add Emoji
    //     </button>
    //   </div>

    //   {/* Time Scope Selection */}
    //   <div className="mb-4">
    //     <select
    //       className="border p-2"
    //       value={timeScope}
    //       onChange={(e) => setTimeScope(e.target.value)}
    //     >
    //       <option value="overall">Overall</option>
    //       <option value="1 day">Last 1 Day</option>
    //       <option value="1 week">Last 1 Week</option>
    //       <option value="1 month">Last 1 Month</option>
    //       <option value="6 months">Last 6 Months</option>
    //       <option value="1 year">Last 1 Year</option>
    //     </select>
    //   </div>

    //   {/* Polar Area Chart */}
    //   <div>
    //     <PolarArea data={prepareChartData()} />
    //   </div>
    // </div>
  );
};

export default PolarAreaChart;
