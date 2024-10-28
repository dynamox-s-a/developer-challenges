"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useTheme } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const MonitoringPointsChart: React.FC<{
  hfplus: number;
  tcag: number;
  tcas: number;
}> = ({ hfplus, tcag, tcas }) => {
  const theme = useTheme();

  const data = {
    labels: ["HF+", "TcAg", "TcAs"],
    datasets: [
      {
        data: [hfplus, tcag, tcas],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.primary.darker,
          theme.palette.primary.lighter,
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

  if (hfplus === 0 && tcag === 0 && tcas === 0) {
    return (
      <div style={{ width: "100%", height: "100%", marginBottom: 2 }}>
        <h2 style={{ textAlign: "center" }}>Monitoring Points Sensors</h2>
        <p style={{ textAlign: "center", color: "gray" }}>
          No monitoring points available.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", marginBottom: 2 }}>
      <h2 style={{ textAlign: "center" }}>Monitoring Points Sensors</h2>
      <Pie data={data} options={options} />
    </div>
  );
};

export default MonitoringPointsChart;
