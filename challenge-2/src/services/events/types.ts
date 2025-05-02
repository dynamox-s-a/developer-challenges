export type EventCategory =
	| "Conferência"
	| "Workshop"
	| "Webinar"
	| "Networking"
	| "Outro";

export interface Event {
	id: string;
	title: string;
	description: string;
	date: string;
	location: string;
	category: EventCategory;
	imageUrl?: string;
}

export interface EventsState {
	data: Event[];
	loading: boolean;
	error: string | null;
}

export interface EventFilters {
	search?: string;
	startDate?: string;
	endDate?: string;
	sortBy?: "date" | "title";
	order?: "asc" | "desc";
}

export interface EventsService {
	getEvents(filters?: EventFilters): Promise<EventsState>;
	createEvent(event: Omit<Event, "id">): Promise<Event>;
	updateEvent(id: string, event: Partial<Event>): Promise<Event>;
	deleteEvent(id: string): Promise<void>;
}
