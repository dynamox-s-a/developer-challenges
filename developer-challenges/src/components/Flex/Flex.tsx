import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import type { MarginProps } from "../common/MarginProps";

export interface FlexProps extends MarginProps {
	children: ReactNode;
	direction?: "row" | "row-reverse" | "column" | "column-reverse";
	justify?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
	align?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
	gap?: number | string;
}

export function Flex({ children, direction = "row", justify, align, gap, ...marginProps }: FlexProps) {
	return (
		<Box
			sx={{
				display: "flex",
				flexWrap: "wrap",
				flexDirection: direction,
				justifyContent: justify,
				alignItems: align,
				gap,
				...marginProps,
			}}
		>
			{children}
		</Box>
	);
}

export default Flex;
