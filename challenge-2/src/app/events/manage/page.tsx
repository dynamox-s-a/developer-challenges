"use client";

import { useState, useMemo } from "react";
import { Container, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EventTable from "./components/event-table";
import EventFormModal from "./components/event-form-modal";
import DeleteConfirmation from "./components/delete-confirmation";
import Notification from "./components/notification";
import {
	EventFilters,
	type EventFilters as EventFiltersType,
} from "./components/event-filters";
import { useManageEvents } from "./controller";

export default function ManageEventsPage() {
	const {
		events,
		loading,
		selectedEvent,
		isModalOpen,
		notification,
		deleteConfirmation,
		onEdit,
		onDelete,
		onConfirmDelete,
		onCloseModal,
		onSubmitEvent,
		onCloseNotification,
	} = useManageEvents();

	const [filters, setFilters] = useState<EventFiltersType>({
		title: "",
		category: "",
		startDate: "",
		endDate: "",
	});

	const filteredEvents = useMemo(() => {
		return events.filter((event) => {
			const matchesTitle = event.title
				.toLowerCase()
				.includes(filters.title.toLowerCase());
			const matchesCategory =
				!filters.category || event.category === filters.category;
			const eventDate = new Date(event.date);
			const matchesStartDate =
				!filters.startDate || eventDate >= new Date(filters.startDate);
			const matchesEndDate =
				!filters.endDate || eventDate <= new Date(filters.endDate);

			return (
				matchesTitle && matchesCategory && matchesStartDate && matchesEndDate
			);
		});
	}, [events, filters]);

	return (
		<Container maxWidth="lg" className="py-4 sm:py-8 px-2 sm:px-4">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
				<Typography
					variant="h4"
					className="text-2xl sm:text-3xl"
					sx={{ color: "var(--color-primary)", fontWeight: 600 }}
				>
					Gerenciar Eventos
				</Typography>
				<Button
					variant="contained"
					color="primary"
					startIcon={<AddIcon />}
					size="large"
					onClick={() => onEdit(null)}
					sx={{
						backgroundColor: "var(--color-primary)",
						width: { xs: "100%", sm: "auto" },
					}}
				>
					Novo Evento
				</Button>
			</div>

			<EventFilters filters={filters} onFilterChange={setFilters} />

			<EventTable
				events={filteredEvents}
				loading={loading}
				onEdit={onEdit}
				onDelete={onDelete}
			/>

			<EventFormModal
				open={isModalOpen}
				onClose={onCloseModal}
				onSubmit={onSubmitEvent}
				event={selectedEvent}
				title={selectedEvent ? "Editar Evento" : "Novo Evento"}
			/>

			{deleteConfirmation && (
				<DeleteConfirmation
					open={!!deleteConfirmation}
					onClose={() => onDelete(null)}
					onConfirm={onConfirmDelete}
					event={deleteConfirmation}
				/>
			)}

			<Notification
				open={notification.open}
				message={notification.message}
				severity={notification.severity}
				onClose={onCloseNotification}
			/>
		</Container>
	);
}
