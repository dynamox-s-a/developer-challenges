import { renderHook, act } from "@testing-library/react";
import { useManageEvents } from "../controller";
import { useEvents } from "@/services/events";
import { useSelector } from "react-redux";
import type { Event } from "@/services/events/types";

jest.mock("@/services/events", () => ({
	useEvents: jest.fn(),
}));

jest.mock("react-redux", () => ({
	useSelector: jest.fn() as unknown as typeof useSelector,
}));

describe("useManageEvents", () => {
	const mockEvent: Event = {
		id: "1",
		title: "Test Event",
		description: "Test Description".padEnd(50, " "),
		date: "2025-12-31",
		location: "Test Location",
		category: "Conferência",
		imageUrl: "http://example.com/image.jpg",
	};

	const mockEvents = [mockEvent];
	const mockService = {
		createEvent: jest.fn(),
		updateEvent: jest.fn(),
		deleteEvent: jest.fn(),
	};
	const mockFetchEvents = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		(useEvents as jest.Mock).mockReturnValue({
			loading: false,
			service: mockService,
			fetchEvents: mockFetchEvents,
		});
		(useSelector as unknown as jest.Mock).mockReturnValue(mockEvents);

		const mockToken = "mock-token";
		Object.defineProperty(window, "localStorage", {
			value: {
				removeItem: jest.fn(),
				getItem: jest.fn((key) => (key === "token" ? mockToken : null)),
				setItem: jest.fn(),
				clear: jest.fn(),
				key: jest.fn(),
				length: 0,
			},
			writable: true,
		});

		Object.defineProperty(window, "location", {
			value: { href: "" },
			writable: true,
		});
	});

	describe("Event Creation", () => {
		it("should create event successfully", async () => {
			const { result } = renderHook(() => useManageEvents());

			await act(async () => {
				await result.current.onSubmitEvent({
					title: "New Event",
					description: "New Description".padEnd(50, " "),
					date: "2025-12-31",
					location: "New Location",
					category: "Workshop",
					imageUrl: "",
				});
			});

			expect(mockService.createEvent).toHaveBeenCalled();
			expect(mockFetchEvents).toHaveBeenCalled();
			expect(result.current.notification).toEqual({
				open: true,
				message: "Evento criado com sucesso!",
				severity: "success",
			});
		});

		it("should validate event date", async () => {
			const { result } = renderHook(() => useManageEvents());

			await act(async () => {
				await result.current.onSubmitEvent({
					title: "Past Event",
					description: "Description".padEnd(50, " "),
					date: "2020-01-01",
					location: "Location",
					category: "Workshop",
					imageUrl: "",
				});
			});

			expect(mockService.createEvent).not.toHaveBeenCalled();
			expect(result.current.notification).toEqual({
				open: true,
				message: "A data do evento deve ser futura.",
				severity: "error",
			});
		});

		it("should validate description length", async () => {
			const { result } = renderHook(() => useManageEvents());

			await act(async () => {
				await result.current.onSubmitEvent({
					title: "Short Description Event",
					description: "Too short",
					date: "2025-12-31",
					location: "Location",
					category: "Workshop",
					imageUrl: "",
				});
			});

			expect(mockService.createEvent).not.toHaveBeenCalled();
			expect(result.current.notification).toEqual({
				open: true,
				message: "A descrição deve ter no mínimo 50 caracteres.",
				severity: "error",
			});
		});
	});

	describe("Event Update", () => {
		it("should update event successfully", async () => {
			const { result } = renderHook(() => useManageEvents());

			act(() => {
				result.current.onEdit(mockEvent);
			});

			await act(async () => {
				await result.current.onSubmitEvent({
					...mockEvent,
					title: "Updated Title",
				});
			});

			expect(mockService.updateEvent).toHaveBeenCalledWith("1", {
				...mockEvent,
				title: "Updated Title",
			});
			expect(mockFetchEvents).toHaveBeenCalled();
			expect(result.current.notification).toEqual({
				open: true,
				message: "Evento atualizado com sucesso!",
				severity: "success",
			});
		});
	});

	describe("Event Deletion", () => {
		it("should delete event successfully", async () => {
			const { result } = renderHook(() => useManageEvents());

			act(() => {
				result.current.onDelete(mockEvent);
			});

			expect(result.current.deleteConfirmation).toBe(mockEvent);

			await act(async () => {
				await result.current.onConfirmDelete();
			});

			expect(mockService.deleteEvent).toHaveBeenCalledWith("1");
			expect(mockFetchEvents).toHaveBeenCalled();
			expect(result.current.notification).toEqual({
				open: true,
				message: "Evento excluído com sucesso!",
				severity: "success",
			});
			expect(result.current.deleteConfirmation).toBeNull();
		});
	});

	describe("Error Handling", () => {
		it("should handle unauthorized error", async () => {
			const { result } = renderHook(() => useManageEvents());
			mockService.createEvent.mockRejectedValueOnce(new Error("Unauthorized"));

			await act(async () => {
				await result.current.onSubmitEvent({
					title: "New Event",
					description: "New Description".padEnd(50, " "),
					date: "2025-12-31",
					location: "New Location",
					category: "Workshop",
					imageUrl: "",
				});
			});

			expect(window.localStorage.removeItem).toHaveBeenCalledWith("token");
			expect(window.location.href).toBe("/login");
		});

		it("should handle general error in create/update", async () => {
			const { result } = renderHook(() => useManageEvents());
			mockService.createEvent.mockRejectedValueOnce(new Error("Network error"));

			await act(async () => {
				await result.current.onSubmitEvent({
					title: "New Event",
					description: "New Description".padEnd(50, " "),
					date: "2025-12-31",
					location: "New Location",
					category: "Workshop",
					imageUrl: "",
				});
			});

			expect(result.current.notification).toEqual({
				open: true,
				message: "Erro ao criar evento. Tente novamente.",
				severity: "error",
			});
		});

		it("should handle general error in delete", async () => {
			const { result } = renderHook(() => useManageEvents());
			mockService.deleteEvent.mockRejectedValueOnce(new Error("Network error"));

			act(() => {
				result.current.onDelete(mockEvent);
			});

			await act(async () => {
				await result.current.onConfirmDelete();
			});

			expect(result.current.notification).toEqual({
				open: true,
				message: "Erro ao excluir evento. Tente novamente.",
				severity: "error",
			});
		});
	});

	describe("Modal Management", () => {
		it("should handle modal open/close", () => {
			const { result } = renderHook(() => useManageEvents());

			act(() => {
				result.current.onEdit(mockEvent);
			});

			expect(result.current.isModalOpen).toBe(true);
			expect(result.current.selectedEvent).toBe(mockEvent);

			act(() => {
				result.current.onCloseModal();
			});

			expect(result.current.isModalOpen).toBe(false);
			expect(result.current.selectedEvent).toBeNull();
		});
	});

	describe("Notification Management", () => {
		it("should handle notification close", () => {
			const { result } = renderHook(() => useManageEvents());

			act(() => {
				result.current.onCloseNotification();
			});

			expect(result.current.notification.open).toBe(false);
		});
	});
});
