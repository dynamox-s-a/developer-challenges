import { EventsServiceImpl } from "../events-service";
import type { Event, EventCategory } from "../types";

describe("EventsService", () => {
	let eventsService: EventsServiceImpl;
	let fetchMock: jest.Mock;
	const baseUrl = "http://localhost:3001";

	const mockEvent: Event = {
		id: "1",
		title: "Test Event",
		description: "Test Description",
		date: "2024-01-01",
		location: "Test Location",
		category: "Conferência" as EventCategory,
		imageUrl: "http://example.com/image.jpg",
	};

	beforeEach(() => {
		fetchMock = jest.fn();
		global.fetch = fetchMock;
		eventsService = new EventsServiceImpl(baseUrl);

		const mockStorage = {
			getItem: jest.fn((key) => (key === "token" ? "mock-token" : null)),
			setItem: jest.fn(),
			removeItem: jest.fn(),
			clear: jest.fn(),
			key: jest.fn(),
			length: 0,
		};

		Object.defineProperty(global, "localStorage", {
			value: mockStorage,
			writable: true,
		});
	});

	describe("getEvents", () => {
		it("should fetch events successfully without filters", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve([mockEvent]),
			});

			const result = await eventsService.getEvents();

			expect(result).toEqual({
				data: [mockEvent],
				loading: false,
				error: null,
			});
			expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/events`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer mock-token",
				},
			});
		});

		it("should fetch events with search filter", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve([mockEvent]),
			});

			await eventsService.getEvents({ search: "test" });

			expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/events?q=test`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer mock-token",
				},
			});
		});

		it("should fetch events with date filters", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve([mockEvent]),
			});

			await eventsService.getEvents({
				startDate: "2024-01-01",
				endDate: "2024-12-31",
			});

			expect(fetchMock).toHaveBeenCalledWith(
				`${baseUrl}/events?date_gte=2024-01-01&date_lte=2024-12-31`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer mock-token",
					},
				},
			);
		});

		it("should fetch events with sorting", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve([mockEvent]),
			});

			await eventsService.getEvents({
				sortBy: "date",
				order: "desc",
			});

			expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/events?_sort=-date`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer mock-token",
				},
			});
		});

		it("should handle API errors", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: false,
				status: 500,
			});

			const result = await eventsService.getEvents();

			expect(result).toEqual({
				data: [],
				loading: false,
				error: "HTTP error! status: 500",
			});
		});
	});

	describe("createEvent", () => {
		const newEvent: Omit<Event, "id"> = {
			title: "New Event",
			description: "New Description",
			date: "2024-02-01",
			location: "New Location",
			category: "Workshop",
		};

		it("should create event successfully", async () => {
			const createdEvent = { ...newEvent, id: "2" };
			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(createdEvent),
			});

			const result = await eventsService.createEvent(newEvent);

			expect(result).toEqual(createdEvent);
			expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/events`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer mock-token",
				},
				body: JSON.stringify(newEvent),
			});
		});

		it("should handle create event error", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: false,
				status: 400,
			});

			await expect(eventsService.createEvent(newEvent)).rejects.toThrow(
				"HTTP error! status: 400",
			);
		});
	});

	describe("updateEvent", () => {
		const updateData: Partial<Event> = {
			title: "Updated Title",
			description: "Updated Description",
		};

		it("should update event successfully", async () => {
			const updatedEvent = { ...mockEvent, ...updateData };
			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(updatedEvent),
			});

			const result = await eventsService.updateEvent("1", updateData);

			expect(result).toEqual(updatedEvent);
			expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/events/1`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer mock-token",
				},
				body: JSON.stringify(updateData),
			});
		});

		it("should handle update event error", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: false,
				status: 404,
			});

			await expect(
				eventsService.updateEvent("999", updateData),
			).rejects.toThrow("HTTP error! status: 404");
		});
	});

	describe("deleteEvent", () => {
		it("should delete event successfully", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: true,
			});

			await eventsService.deleteEvent("1");

			expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/events/1`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer mock-token",
				},
			});
		});

		it("should handle delete event error", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: false,
				status: 404,
			});

			await expect(eventsService.deleteEvent("999")).rejects.toThrow(
				"HTTP error! status: 404",
			);
		});
	});
});
