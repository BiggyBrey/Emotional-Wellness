import React, { useState, useEffect } from "react";
import { PolarArea } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import "chartjs-adapter-moment"; // for time filtering

Chart.register(ArcElement, Tooltip, Legend);

const PolarAreaChart = () => {
  const [emojiData, setEmojiData] = useState([]);
  const [emoji, setEmoji] = useState("");
  const [date, setDate] = useState("");
  const [timeScope, setTimeScope] = useState("overall");

  useEffect(() => {
    // Re-render the chart on scope change
  }, [timeScope]);

  const handleAddEmoji = () => {
    if (emoji && date) {
      setEmojiData([...emojiData, { emoji, date: new Date(date) }]);
      setEmoji("");
      setDate("");
    }
  };

  const filterByScope = () => {
    const now = new Date();
    let filteredData = emojiData;
    switch (timeScope) {
      case "1 day":
        filteredData = emojiData.filter(
          (entry) => (now - entry.date) / (1000 * 60 * 60 * 24) <= 1
        );
        break;
      case "1 week":
        filteredData = emojiData.filter(
          (entry) => (now - entry.date) / (1000 * 60 * 60 * 24 * 7) <= 1
        );
        break;
      case "1 month":
        filteredData = emojiData.filter(
          (entry) => (now - entry.date) / (1000 * 60 * 60 * 24 * 30) <= 1
        );
        break;
      case "6 months":
        filteredData = emojiData.filter(
          (entry) => (now - entry.date) / (1000 * 60 * 60 * 24 * 180) <= 1
        );
        break;
      case "1 year":
        filteredData = emojiData.filter(
          (entry) => (now - entry.date) / (1000 * 60 * 60 * 24 * 365) <= 1
        );
        break;
      case "overall":
      default:
        filteredData = emojiData;
        break;
    }
    return filteredData;
  };

  const prepareChartData = () => {
    const filteredData = filterByScope();
    const emojiCount = {};
    
    filteredData.forEach((entry) => {
      if (emojiCount[entry.emoji]) {
        emojiCount[entry.emoji]++;
      } else {
        emojiCount[entry.emoji] = 1;
      }
    });

    return {
      labels: Object.keys(emojiCount),
      datasets: [
        {
          data: Object.values(emojiCount),
          backgroundColor: Object.keys(emojiCount).map(() =>
            `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`
          ),
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Emoji Polar Area Chart</h1>

      {/* Emoji Input Form */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Emoji"
          className="border p-2 mr-2"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 mr-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          onClick={handleAddEmoji}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Emoji
        </button>
      </div>

      {/* Time Scope Selection */}
      <div className="mb-4">
        <select
          className="border p-2"
          value={timeScope}
          onChange={(e) => setTimeScope(e.target.value)}
        >
          <option value="overall">Overall</option>
          <option value="1 day">Last 1 Day</option>
          <option value="1 week">Last 1 Week</option>
          <option value="1 month">Last 1 Month</option>
          <option value="6 months">Last 6 Months</option>
          <option value="1 year">Last 1 Year</option>
        </select>
      </div>

      {/* Polar Area Chart */}
      <div>
        <PolarArea data={prepareChartData()} />
      </div>
    </div>
  );
};

export default PolarAreaChart;
