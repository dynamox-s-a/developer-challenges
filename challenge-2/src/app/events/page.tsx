"use client";

import { CardEvent } from "@/components/card-event";
import { CardEventSkeleton } from "@/components/card-event/skeleton";
import { EventFilters } from "@/components/event-filters";
import { useEvents } from "@/services/events";
import type { RootState } from "@/store";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import {
	Box,
	Container,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";

export default function EventsPage() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const { loading, error } = useEvents();
	const events = useSelector((state: RootState) => state.events.filteredItems);

	if (error) {
		return (
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Typography color="error" variant="h6">
					{error}
				</Typography>
			</Container>
		);
	}

	const hasNoResults = !loading && events.length === 0;

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Box
				sx={{
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
					gap: 3,
				}}
			>
				<Box
					sx={{
						width: { xs: "100%", md: "300px" },
						position: { xs: "static", md: "sticky" },
						top: { md: "1rem" },
						height: { md: "fit-content" },
					}}
				>
					<EventFilters />
				</Box>

				<Box sx={{ flex: 1 }}>
					{hasNoResults ? (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								gap: 2,
								py: 8,
								textAlign: "center",
							}}
						>
							<SearchOffIcon sx={{ fontSize: 64, color: "text.secondary" }} />
							<Typography variant="h6" color="text.secondary">
								Nenhum evento encontrado
							</Typography>
							<Typography color="text.secondary">
								Tente ajustar os filtros para encontrar mais eventos
							</Typography>
						</Box>
					) : (
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: {
									xs: "1fr",
									sm: isMobile ? "repeat(2, 1fr)" : "1fr",
									md: "repeat(2, 1fr)",
								},
								gap: 3,
							}}
						>
							{loading
								? Array.from({ length: 4 }).map((_, index) => (
										<CardEventSkeleton key={index} />
									))
								: events.map((event) => (
										<CardEvent
											key={event.id}
											id={event.id}
											title={event.title}
											description={event.description}
											date={event.date}
										/>
									))}
						</Box>
					)}
				</Box>
			</Box>
		</Container>
	);
}
