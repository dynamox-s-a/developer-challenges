import type { Meta, StoryObj } from "@storybook/react-vite";
import * as MuiIcons from "@mui/icons-material";
import { Icon } from "./Icon";

// exibe todos os icones da materialUi no storybook
const iconNames = Object.keys(MuiIcons).filter((name) => name !== "default");
const meta = {
	title: "Components/Icon",
	component: Icon,
	argTypes: {
		icon: {
			control: "select",
			options: iconNames,
		},
		color: {
			control: "select",
			options: [
				"inherit",
				"action",
				"disabled",
				"primary",
				"secondary",
				"error",
				"info",
				"success",
				"warning",
			],
		},
		size: {
			control: "select",
			options: ["inherit", "small", "medium", "large"],
		},
		text: {
			control: "text",
		},
		m: { control: "number" },
		mt: { control: "number" },
		mb: { control: "number" },
		ml: { control: "number" },
		mr: { control: "number" },
	},
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		icon: "Sensors",
		text: "Sensor icon",
		color: "primary",
		size: "medium",
	},
};

export const AllIcons: Story = {
	args: {
		icon: "Sensors",
	},
	render: () => (
		<div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
			{iconNames.map((name) => (
				<div
					key={name}
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						width: 96,
					}}
				>
					<Icon icon={name as keyof typeof MuiIcons} />
					<span
						style={{
							fontSize: 10,
							textAlign: "center",
							wordBreak: "break-all",
						}}
					>
						{name}
					</span>
				</div>
			))}
		</div>
	),
};
