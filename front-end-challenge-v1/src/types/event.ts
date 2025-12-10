export type EventCategory =
  | "Conference"
  | "Workshop"
  | "Webinar"
  | "Networking"
  | "Other";

export interface Event {
  id: string;
  name: string;
  dateTime: string;
  location: string;
  description: string;
  category: EventCategory;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventPayload {
  name: string;
  dateTime: string;
  location: string;
  description: string;
  category: EventCategory;
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {
  id: string;
}

export interface EventsState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
}

export type EventSortField = "name" | "dateTime";
export type SortOrder = "asc" | "desc";

export interface EventFilters {
  search: string;
  category: EventCategory | "";
  sortField: EventSortField;
  sortOrder: SortOrder;
}
