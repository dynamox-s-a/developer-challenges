import type { Event } from "@/services/events/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface EventsState {
	items: Event[];
	filteredItems: Event[];
	filters: {
		searchTerm: string;
		sortBy: "date" | "title";
		order: "asc" | "desc";
		period: "all" | "past" | "future";
	};
	loading: boolean;
	error: string | null;
}

const initialState: EventsState = {
	items: [],
	filteredItems: [],
	filters: {
		searchTerm: "",
		sortBy: "date",
		order: "desc",
		period: "all",
	},
	loading: false,
	error: null,
};

const applyFilters = (
	events: Event[],
	filters: EventsState["filters"],
): Event[] => {
	let filtered = events;

	if (filters.searchTerm) {
		const searchLower = filters.searchTerm.toLowerCase();
		filtered = filtered.filter(
			(event) =>
				event.title.toLowerCase().includes(searchLower) ||
				event.description.toLowerCase().includes(searchLower),
		);
	}

	if (filters.period !== "all") {
		const now = new Date();
		filtered = filtered.filter((event) => {
			const eventDate = new Date(event.date);
			return filters.period === "future" ? eventDate >= now : eventDate < now;
		});
	}

	return filtered.sort((a, b) => {
		const modifier = filters.order === "desc" ? -1 : 1;

		if (filters.sortBy === "date") {
			const dateA = new Date(a.date).getTime();
			const dateB = new Date(b.date).getTime();
			return (dateA - dateB) * modifier;
		}
		return a.title.localeCompare(b.title) * modifier;
	});
};

export const eventsSlice = createSlice({
	name: "events",
	initialState,
	reducers: {
		setEvents: (state, action: PayloadAction<Event[]>) => {
			state.items = action.payload;
			state.filteredItems = applyFilters(state.items, state.filters);
			state.loading = false;
			state.error = null;
		},
		setSearchTerm: (state, action: PayloadAction<string>) => {
			state.filters.searchTerm = action.payload;
			state.filteredItems = applyFilters(state.items, state.filters);
		},
		setSort: (
			state,
			action: PayloadAction<{ by: "date" | "title"; order: "asc" | "desc" }>,
		) => {
			state.filters.sortBy = action.payload.by;
			state.filters.order = action.payload.order;
			state.filteredItems = applyFilters(state.items, state.filters);
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setError(state, action: PayloadAction<string | null>) {
			state.error = action.payload;
			state.loading = false;
		},
		setPeriod(state, action: PayloadAction<"all" | "past" | "future">) {
			state.filters.period = action.payload;
			state.filteredItems = applyFilters(state.items, state.filters);
		},
		resetFilters(state) {
			state.filters = initialState.filters;
			state.filteredItems = applyFilters(state.items, initialState.filters);
		},
	},
});

export const eventsActions = eventsSlice.actions;
export const {
	setEvents,
	setSearchTerm,
	setSort,
	setLoading,
	setError,
	setPeriod,
	resetFilters,
} = eventsActions;

export default eventsSlice.reducer;
