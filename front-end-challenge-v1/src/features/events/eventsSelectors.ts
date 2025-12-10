import type { RootState } from "@/lib/store";
import type { Event, EventCategory, EventFilters, SortOrder } from "@/types";

// Base selectors
export const selectAllEvents = (state: RootState): Event[] =>
  state.events.events;
export const selectEventsLoading = (state: RootState): boolean =>
  state.events.isLoading;
export const selectEventsError = (state: RootState): string | null =>
  state.events.error;

// Helper function to check if event is upcoming (date is in the future)
export const isUpcomingEvent = (event: Event): boolean => {
  return new Date(event.dateTime) > new Date();
};

// Helper function to check if event is past
export const isPastEvent = (event: Event): boolean => {
  return new Date(event.dateTime) <= new Date();
};

// Select upcoming events only
export const selectUpcomingEvents = (state: RootState): Event[] => {
  return state.events.events.filter(isUpcomingEvent);
};

// Select past events only
export const selectPastEvents = (state: RootState): Event[] => {
  return state.events.events.filter(isPastEvent);
};

// Sort events by field and order
export const sortEvents = (
  events: Event[],
  sortField: "name" | "dateTime",
  sortOrder: SortOrder,
): Event[] => {
  return [...events].sort((a, b) => {
    let comparison = 0;

    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "dateTime") {
      comparison =
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });
};

// Filter events by search term (searches name, location, description)
export const filterEventsBySearch = (
  events: Event[],
  searchTerm: string,
): Event[] => {
  if (!searchTerm.trim()) {
    return events;
  }

  const lowerSearch = searchTerm.toLowerCase();
  return events.filter(
    (event) =>
      event.name.toLowerCase().includes(lowerSearch) ||
      event.location.toLowerCase().includes(lowerSearch) ||
      event.description.toLowerCase().includes(lowerSearch),
  );
};

// Filter events by category
export const filterEventsByCategory = (
  events: Event[],
  category: EventCategory | "",
): Event[] => {
  if (!category) {
    return events;
  }
  return events.filter((event) => event.category === category);
};

// Apply all filters and sorting
export const filterAndSortEvents = (
  events: Event[],
  filters: EventFilters,
): Event[] => {
  let result = [...events];

  // Apply search filter
  result = filterEventsBySearch(result, filters.search);

  // Apply category filter
  result = filterEventsByCategory(result, filters.category);

  // Apply sorting
  result = sortEvents(result, filters.sortField, filters.sortOrder);

  return result;
};

// Selector factory for filtered and sorted events
export const selectFilteredEvents = (
  state: RootState,
  filters: EventFilters,
): Event[] => {
  return filterAndSortEvents(state.events.events, filters);
};

// Selector factory for filtered upcoming events
export const selectFilteredUpcomingEvents = (
  state: RootState,
  filters: EventFilters,
): Event[] => {
  const upcomingEvents = selectUpcomingEvents(state);
  return filterAndSortEvents(upcomingEvents, filters);
};

// Selector factory for filtered past events
export const selectFilteredPastEvents = (
  state: RootState,
  filters: EventFilters,
): Event[] => {
  const pastEvents = selectPastEvents(state);
  return filterAndSortEvents(pastEvents, filters);
};

// Select event by ID
export const selectEventById = (
  state: RootState,
  eventId: string,
): Event | undefined => {
  return state.events.events.find((event) => event.id === eventId);
};

// Get unique categories from events
export const selectEventCategories = (state: RootState): EventCategory[] => {
  const categories = new Set(
    state.events.events.map((event) => event.category),
  );
  return Array.from(categories);
};

// Get event counts
export const selectEventCounts = (
  state: RootState,
): { total: number; upcoming: number; past: number } => {
  const events = state.events.events;
  const upcoming = events.filter(isUpcomingEvent).length;
  const past = events.filter(isPastEvent).length;

  return {
    total: events.length,
    upcoming,
    past,
  };
};
