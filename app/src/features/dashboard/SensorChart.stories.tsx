import type { Meta, StoryObj } from "@storybook/react-vite";
import { SensorChart } from "./SensorChart";

const meta = {
  title: "Dashboard/SensorChart",
  component: SensorChart,
  parameters: { layout: "padded" },
  args: {
    metric: "velocity",
    activeTimestamp: null,
    onHoverTimestamp: () => undefined,
    series: [
      {
        name: "velocityRms/x",
        data: [
          { datetime: "2023-12-10T12:00:00.000Z", max: 2.4 },
          { datetime: "2023-12-11T12:00:00.000Z", max: 4.1 },
          { datetime: "2023-12-12T12:00:00.000Z", max: 3.3 },
        ],
      },
      {
        name: "velocityRms/y",
        data: [
          { datetime: "2023-12-10T12:00:00.000Z", max: 3.1 },
          { datetime: "2023-12-11T12:00:00.000Z", max: 4.8 },
          { datetime: "2023-12-12T12:00:00.000Z", max: 3.9 },
        ],
      },
    ],
  },
} satisfies Meta<typeof SensorChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
