import { format } from "date-fns";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import { alpha, useTheme } from "@mui/material";

interface CardEventProps {
	id: string;
	title: string;
	description: string;
	date: string;
}

export function CardEvent({ id, title, description, date }: CardEventProps) {
	const router = useRouter();
	const theme = useTheme();
	const formattedDate = format(new Date(date), "dd/MM/yyyy 'às' HH:mm'h'");
	const isPastEvent = new Date(date) < new Date();

	return (
		<Paper
			onClick={() => router.push(`/events/${id}`)}
			sx={{
				height: 280,
				display: "flex",
				flexDirection: "column",
				p: 3,
				position: "relative",
				overflow: "hidden",
				opacity: isPastEvent ? 0.7 : 1,
				background:
					"linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%)",
				color: "white",
				transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
				"&:hover": {
					transform: "translateY(-4px)",
					boxShadow: theme.shadows[8],
					cursor: "pointer",
					"& .arrow-icon": {
						transform: "translateX(4px)",
					},
				},
				"&::before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(circle at top right, var(--color-primary) 0%, transparent 60%)
          `,
					pointerEvents: "none",
				},
			}}
		>
			<Box
				sx={{
					mb: 2,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-start",
				}}
			>
				<Typography
					variant="h6"
					component="h3"
					sx={{
						fontWeight: 700,
						fontSize: "1.25rem",
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
						lineHeight: 1.3,
						height: 50,
						mr: 2,
					}}
				>
					{title}
				</Typography>
				<ArrowForwardIcon
					className="arrow-icon"
					sx={{
						transition: "transform 0.2s ease-in-out",
						color: alpha(theme.palette.common.white, 0.8),
					}}
				/>
			</Box>

			<Typography
				sx={{
					flex: "1 1 auto",
					color: alpha(theme.palette.common.white, 0.9),
					display: "-webkit-box",
					WebkitLineClamp: 3,
					WebkitBoxOrient: "vertical",
					overflow: "hidden",
					lineHeight: 1.6,
					fontSize: "0.9rem",
					minHeight: 120,
				}}
			>
				{description}
			</Typography>

			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
					mt: 3,
					color: alpha(theme.palette.common.white, 0.9),
				}}
			>
				<CalendarTodayIcon fontSize="small" />
				<Typography variant="body2" sx={{ fontWeight: 500 }}>
					{formattedDate}
				</Typography>
			</Box>
		</Paper>
	);
}
