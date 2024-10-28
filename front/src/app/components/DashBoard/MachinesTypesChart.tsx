"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useTheme } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const MachinesTypesChart: React.FC<{
  pump: number;
  fan: number;
}> = ({ pump, fan }) => {
  const theme = useTheme();

  const data = {
    labels: ["FAN", "PUMP"],
    datasets: [
      {
        data: [pump, fan],
        backgroundColor: [
          theme.palette.primary.dark,
          theme.palette.primary.light,
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const dataset = tooltipItem.dataset;
            const total = dataset.data.reduce(
              (prev: number, curr: number) => prev + curr,
              0
            );
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const percentage = Math.floor((currentValue / total) * 100 + 0.5);
            return `${tooltipItem.label}: ${currentValue} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (pump === 0 && fan === 0) {
    return (
      <div style={{ width: "100%", height: "100%", marginBottom: 2 }}>
        <h2 style={{ textAlign: "center" }}>Types of Machines</h2>
        <p style={{ textAlign: "center", color: "gray" }}>
          No machines available.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", marginBottom: 2 }}>
      <h2 style={{ textAlign: "center" }}>Types of Machines</h2>
      <Pie data={data} options={options} />
    </div>
  );
};

export default MachinesTypesChart;
