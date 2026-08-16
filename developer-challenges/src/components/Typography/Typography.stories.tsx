import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography } from "./Typography";

const meta = {
	title: "Components/Typography",
	component: Typography,
	argTypes: {
		size: {
			control: "select",
			options: [
				"h1",
				"h2",
				"h3",
				"h4",
				"h5",
				"h6",
				"subtitle1",
				"subtitle2",
				"body1",
				"body2",
				"caption",
				"button",
				"overline",
				"inherit",
			],
		},
		color: {
			control: "select",
			options: ["initial", "inherit", "primary", "secondary", "textPrimary", "textSecondary", "error"],
		},
		align: {
			control: "select",
			options: ["inherit", "left", "center", "right", "justify"],
		},
		m: { control: "number" },
		mt: { control: "number" },
		mb: { control: "number" },
		ml: { control: "number" },
		mr: { control: "number" },
	},
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		text: "Text Component",
		size: "body1",
		color: "initial",
		align: "inherit",
	},
};
