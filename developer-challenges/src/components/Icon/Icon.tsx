import AccessTime from "@mui/icons-material/esm/AccessTime";
import GpsFixed from "@mui/icons-material/esm/GpsFixed";
import PrecisionManufacturing from "@mui/icons-material/esm/PrecisionManufacturing";
import Sensors from "@mui/icons-material/esm/Sensors";
import Speed from "@mui/icons-material/esm/Speed";
import Vibration from "@mui/icons-material/esm/Vibration";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { MarginProps } from "../common/MarginProps";
import DynamicRangeIcon from "./icons/DynamicRangeIcon";
import MachineIcon from "./icons/MachineIcon";
import RpmIcon from "./icons/RpmIcon";

const ICONS = {
	AccessTime,
	DynamicRange: DynamicRangeIcon,
	GpsFixed,
	Machine: MachineIcon,
	PrecisionManufacturing,
	Rpm: RpmIcon,
	Sensors,
	Speed,
	Vibration,
} as const;

export type IconName = keyof typeof ICONS;

export interface IconProps extends MarginProps {
	icon: IconName;
	text?: string;
	color?: SvgIconProps["color"];
	size?: SvgIconProps["fontSize"];
}

export function Icon({ icon, text, color, size, ...marginProps }: IconProps) {
	const IconComponent = ICONS[icon];
	return (
		<IconComponent
			titleAccess={text}
			color={color}
			fontSize={size}
			sx={marginProps}
		/>
	);
}

export default Icon;
