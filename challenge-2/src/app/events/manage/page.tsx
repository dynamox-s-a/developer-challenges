"use client";
import { Container, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EventTable from "./components/event-table";
import EventFormModal from "./components/event-form-modal";
import DeleteConfirmation from "./components/delete-confirmation";
import Notification from "./components/notification";
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

	return (
		<Container maxWidth="lg" className="py-8">
			<div className="flex justify-between items-center mb-6">
				<Typography
					variant="h4"
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
					}}
				>
					Novo Evento
				</Button>
			</div>

			<EventTable
				events={events}
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
