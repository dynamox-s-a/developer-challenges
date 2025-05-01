import type { Event, EventFilters, EventsService, EventsState } from "./types";

export class EventsServiceImpl implements EventsService {
	private baseUrl: string;

	constructor(baseUrl = "http://localhost:3001") {
		this.baseUrl = baseUrl;
	}

	private getAuthHeaders(): HeadersInit {
		const token = localStorage.getItem("token");
		return {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		};
	}

	async createEvent(event: Omit<Event, "id">): Promise<Event> {
		const response = await fetch(`${this.baseUrl}/events`, {
			method: "POST",
			headers: this.getAuthHeaders(),
			body: JSON.stringify(event),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response.json();
	}

	async updateEvent(id: string, event: Partial<Event>): Promise<Event> {
		const response = await fetch(`${this.baseUrl}/events/${id}`, {
			method: "PATCH",
			headers: this.getAuthHeaders(),
			body: JSON.stringify(event),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response.json();
	}

	async deleteEvent(id: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}/events/${id}`, {
			method: "DELETE",
			headers: this.getAuthHeaders(),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
	}

	private buildQueryString(filters?: EventFilters): string {
		if (!filters) return "";

		const params = new URLSearchParams();

		if (filters.search) {
			params.append("q", filters.search);
		}

		if (filters.startDate) {
			params.append("date_gte", filters.startDate);
		}

		if (filters.endDate) {
			params.append("date_lte", filters.endDate);
		}

		if (filters.sortBy) {
			const sortPrefix = filters.order === "desc" ? "-" : "";
			params.append("_sort", `${sortPrefix}${filters.sortBy}`);
		}

		const queryString = params.toString();
		return queryString ? `?${queryString}` : "";
	}

	async getEvents(filters?: EventFilters): Promise<EventsState> {
		try {
			const queryString = this.buildQueryString(filters);
			const response = await fetch(`${this.baseUrl}/events${queryString}`);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: Event[] = await response.json();

			return {
				data,
				loading: false,
				error: null,
			};
		} catch (error) {
			return {
				data: [],
				loading: false,
				error:
					error instanceof Error ? error.message : "Failed to fetch events",
			};
		}
	}
}
