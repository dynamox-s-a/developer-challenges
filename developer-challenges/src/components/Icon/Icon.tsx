import * as MuiIcons from "@mui/icons-material";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { MarginProps } from "../common/MarginProps";

export type IconName = keyof typeof MuiIcons;

export interface IconProps extends MarginProps {
	icon: IconName;
	text?: string;
	color?: SvgIconProps["color"];
	size?: SvgIconProps["fontSize"];
}

export function Icon({ icon, text, color, size, ...marginProps }: IconProps) {
	const IconComponent = MuiIcons[icon];
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
