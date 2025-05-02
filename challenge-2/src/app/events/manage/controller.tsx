"use client";
import { useState } from "react";
import { useEvents } from "@/services/events";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { Event } from "@/services/events/types";
import type { EventFormData } from "./types";

type NotificationType = {
	open: boolean;
	message: string;
	severity: "success" | "error";
};

export function useManageEvents() {
	const { loading, service, fetchEvents } = useEvents();
	const events = useSelector((state: RootState) => state.events.items);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteConfirmation, setDeleteConfirmation] = useState<Event | null>(
		null,
	);
	const [notification, setNotification] = useState<NotificationType>({
		open: false,
		message: "",
		severity: "success",
	});

	const showNotification = (message: string, severity: "success" | "error") => {
		setNotification({
			open: true,
			message,
			severity,
		});
	};

	const handleCloseNotification = () => {
		setNotification((prev) => ({ ...prev, open: false }));
	};

	const handleEditEvent = (event: Event | null) => {
		setSelectedEvent(event);
		setIsModalOpen(true);
	};

	const handleDeleteEvent = (event: Event | null) => {
		setDeleteConfirmation(event);
	};

	const handleUnauthorizedError = () => {
		localStorage.removeItem("token");
		window.location.href = "/login";
	};

	const handleConfirmDelete = async () => {
		if (!deleteConfirmation) return;

		try {
			await service.deleteEvent(String(deleteConfirmation.id));
			showNotification("Evento excluído com sucesso!", "success");
			await fetchEvents();
		} catch (error) {
			console.error("Error deleting event:", error);
			if (error instanceof Error && error.message === "Unauthorized") {
				handleUnauthorizedError();
				return;
			}
			showNotification("Erro ao excluir evento. Tente novamente.", "error");
		} finally {
			setDeleteConfirmation(null);
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedEvent(null);
	};

	const handleSubmitEvent = async (data: EventFormData) => {
		try {
			const eventDate = new Date(data.date);
			const now = new Date();

			if (eventDate <= now) {
				showNotification("A data do evento deve ser futura.", "error");
				return;
			}

			if (data.description.length < 50) {
				showNotification(
					"A descrição deve ter no mínimo 50 caracteres.",
					"error",
				);
				return;
			}

			const eventData = {
				...data,
				imageUrl: data.imageUrl || undefined,
			};

			if (selectedEvent) {
				await service.updateEvent(String(selectedEvent.id), eventData);
				showNotification("Evento atualizado com sucesso!", "success");
			} else {
				await service.createEvent(eventData);
				showNotification("Evento criado com sucesso!", "success");
			}
			handleCloseModal();
			await fetchEvents();
		} catch (error) {
			console.error("Error creating event:", error);
			if (error instanceof Error && error.message === "Unauthorized") {
				handleUnauthorizedError();
				return;
			}
			showNotification(
				`Erro ao ${selectedEvent ? "atualizar" : "criar"} evento. Tente novamente.`,
				"error",
			);
		}
	};

	return {
		events,
		loading,
		selectedEvent,
		isModalOpen,
		notification,
		deleteConfirmation,
		onEdit: handleEditEvent,
		onDelete: handleDeleteEvent,
		onConfirmDelete: handleConfirmDelete,
		onCloseModal: handleCloseModal,
		onSubmitEvent: handleSubmitEvent,
		onCloseNotification: handleCloseNotification,
	};
}
