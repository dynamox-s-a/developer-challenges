import type { Meta, StoryObj } from "@storybook/react-vite";
import MachineInfoBar from "../app/components/MachineInfoBar";
import { machine } from "./fixtures";

const meta = {
  title: "Components/MachineInfoBar",
  component: MachineInfoBar,
  tags: ["autodocs"],
  args: { machine },
} satisfies Meta<typeof MachineInfoBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OtherMachine: Story = {
  args: {
    machine: {
      name: "Máquina 2048",
      point: "Ponto 31415",
      sampleRate: 400,
      range: "8g",
      interval: "10 min",
    },
  },
};
