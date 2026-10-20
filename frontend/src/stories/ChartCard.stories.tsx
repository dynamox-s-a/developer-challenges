import type { Meta, StoryObj } from "@storybook/react-vite";
import ChartCard from "../app/components/ChartCard";

const meta = {
  title: "Components/ChartCard",
  component: ChartCard,
  tags: ["autodocs"],
  args: { title: "Temperatura", children: "Chart goes here" },
} satisfies Meta<typeof ChartCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
