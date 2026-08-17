import type { Meta, StoryObj } from "@storybook/react-vite";
import * as MuiIcons from "@mui/icons-material";
import { Icon, type IconName } from "./Icon";

const curatedIconNames: IconName[] = [
	"AccessTime",
	"DynamicRange",
	"GpsFixed",
	"Machine",
	"Rpm",
	"Sensors",
	"Speed",
	"Vibration",
];

const meta = {
	title: "Components/Icon",
	component: Icon,
	argTypes: {
		icon: {
			control: "select",
			options: curatedIconNames,
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

export const CustomIcons: Story = {
	args: {
		icon: "Machine",
	},
	render: () => (
		<div style={{ display: "flex", gap: 24 }}>
			{(["Machine", "Rpm", "DynamicRange"] as IconName[]).map((name) => (
				<div
					key={name}
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 4,
					}}
				>
					<Icon icon={name} size="large" />
					<span style={{ fontSize: 12 }}>{name}</span>
				</div>
			))}
		</div>
	),
};

// Todos os icones da Material UI
const allIconNames = Object.keys(MuiIcons).filter((name) => name !== "default");

export const MaterialIcons: Story = {
	args: {
		icon: "Sensors",
	},
	render: () => (
		<div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
			{allIconNames.map((name) => {
				const MuiIconComponent = MuiIcons[name as keyof typeof MuiIcons];
				return (
					<div
						key={name}
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							width: 96,
						}}
					>
						<MuiIconComponent />
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
				);
			})}
		</div>
	),
};
