import MuiTypography from "@mui/material/Typography";
import type { TypographyProps as MuiTypographyProps } from "@mui/material/Typography";
import type { MarginProps } from "../common/MarginProps";

export interface TypographyProps extends MarginProps {
	text: string;
	size?: MuiTypographyProps["variant"];
	color?: MuiTypographyProps["color"];
	align?: MuiTypographyProps["align"];
}

export function Typography({ text, size, color, align, ...marginProps }: TypographyProps) {
	return (
		<MuiTypography variant={size} color={color} align={align} sx={marginProps}>
			{text}
		</MuiTypography>
	);
}

export default Typography;
