import type { Meta, StoryObj } from "@storybook/react-vite";
import TimeSeriesChart from "../app/components/TimeSeriesChart";
import { charts } from "./fixtures";

const meta = {
  title: "Components/TimeSeriesChart",
  component: TimeSeriesChart,
  tags: ["autodocs"],
} satisfies Meta<typeof TimeSeriesChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Acceleration: Story = {
  args: {
    series: charts.acceleration,
    yAxisTitle: "Aceleração RMS (g)",
    valueDecimals: 3,
  },
};

export const Velocity: Story = {
  args: {
    series: charts.velocity,
    yAxisTitle: "Velocidade RMS (mm/s)",
    valueDecimals: 2,
  },
};

export const Temperature: Story = {
  args: {
    series: charts.temperature,
    yAxisTitle: "Temperatura (°C)",
    valueDecimals: 1,
  },
};
