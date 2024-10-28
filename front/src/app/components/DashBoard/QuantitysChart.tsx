"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { useTheme } from "@mui/material";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const QuantitysChart: React.FC<{
  sensors: number;
  machines: number;
  monitoringPoints: number;
}> = ({ sensors, machines, monitoringPoints }) => {
  const labels = ["Machines", "Monitoring Points", "Sensors"];
  const theme = useTheme();

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Registereds Number",
        data: [machines, monitoringPoints, sensors],
        backgroundColor: theme.palette.primary.main,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2,
    scales: {
      x: {
        title: {
          display: true,
          text: "Registereds Number",
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Registereds Number",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `Registered quantity: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default QuantitysChart;
