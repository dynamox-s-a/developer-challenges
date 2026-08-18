import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex } from "./Flex";

const meta = {
	title: "Components/Flex",
	component: Flex,
	argTypes: {
		direction: {
			control: "select",
			options: ["row", "row-reverse", "column", "column-reverse"],
		},
		justify: {
			control: "select",
			options: ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"],
		},
		align: {
			control: "select",
			options: ["flex-start", "flex-end", "center", "stretch", "baseline"],
		},
		gap: { control: "number" },
	},
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

const box = (label: string) => (
	<div style={{ background: "#2a78d6", color: "#fff", padding: 12 }}>{label}</div>
);

export const Default: Story = {
	args: {
		direction: "row",
		gap: 2,
		children: [box("1"), box("2"), box("3")],
	},
};
