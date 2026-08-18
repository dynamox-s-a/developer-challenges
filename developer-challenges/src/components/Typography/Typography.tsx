import MuiTypography from "@mui/material/Typography";
import type { TypographyProps as MuiTypographyProps } from "@mui/material/Typography";
import type { MarginProps } from "../common/MarginProps";

export interface TypographyProps extends MarginProps {
	text: string;
	size?: MuiTypographyProps["variant"];
	color?: MuiTypographyProps["color"];
	align?: MuiTypographyProps["align"];
	fontSize?: number;
	bold?: boolean;
	fontWeight?: number;
}

export function Typography({ text, size, color, align, fontSize, bold, fontWeight, ...marginProps }: TypographyProps) {
	return (
		<MuiTypography
			variant={size}
			color={color}
			align={align}
			sx={{
				...marginProps,
				...(fontSize && { fontSize: `${fontSize}px` }),
				...(fontWeight ? { fontWeight } : bold && { fontWeight: "bold" }),
			}}
		>
			{text}
		</MuiTypography>
	);
}

export default Typography;
