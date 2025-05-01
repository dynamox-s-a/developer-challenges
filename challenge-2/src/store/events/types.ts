import type { Event, EventFilters } from "@/services/events/types";

export interface EventsState {
  items: Event[];
  filteredItems: Event[];
  filters: EventFilters;
  loading: boolean;
  error: string | null;
}

export interface SetFiltersPayload {
  filters: EventFilters;
}
