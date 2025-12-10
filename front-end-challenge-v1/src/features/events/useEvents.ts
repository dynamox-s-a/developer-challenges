"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { EventCategory, EventFilters } from "@/types";
import {
  selectAllEvents,
  selectEventCounts,
  selectEventsError,
  selectEventsLoading,
  selectFilteredPastEvents,
  selectFilteredUpcomingEvents,
} from "./eventsSelectors";
import { clearError, fetchEvents } from "./eventsSlice";

const DEFAULT_FILTERS: EventFilters = {
  search: "",
  category: "",
  sortField: "dateTime",
  sortOrder: "asc",
};

export function useEvents(initialFilters: Partial<EventFilters> = {}) {
  const dispatch = useAppDispatch();

  // Local filter state
  const [filters, setFilters] = useState<EventFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  // Redux state
  const allEvents = useAppSelector(selectAllEvents);
  const isLoading = useAppSelector(selectEventsLoading);
  const error = useAppSelector(selectEventsError);
  const counts = useAppSelector(selectEventCounts);

  // Filtered events
  const upcomingEvents = useAppSelector((state) =>
    selectFilteredUpcomingEvents(state, filters),
  );
  const pastEvents = useAppSelector((state) =>
    selectFilteredPastEvents(state, filters),
  );

  // Fetch events on mount
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Filter setters
  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setCategory = useCallback((category: EventCategory | "") => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setSortField = useCallback((sortField: "name" | "dateTime") => {
    setFilters((prev) => ({ ...prev, sortField }));
  }, []);

  const setSortOrder = useCallback((sortOrder: "asc" | "desc") => {
    setFilters((prev) => ({ ...prev, sortOrder }));
  }, []);

  const toggleSortOrder = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const clearErrorMessage = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const refetch = useCallback(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return useMemo(
    () => ({
      // Events data
      allEvents,
      upcomingEvents,
      pastEvents,

      // State
      isLoading,
      error,
      counts,

      // Filters
      filters,
      setFilters,
      setSearch,
      setCategory,
      setSortField,
      setSortOrder,
      toggleSortOrder,
      resetFilters,

      // Actions
      clearError: clearErrorMessage,
      refetch,
    }),
    [
      allEvents,
      upcomingEvents,
      pastEvents,
      isLoading,
      error,
      counts,
      filters,
      setSearch,
      setCategory,
      setSortField,
      setSortOrder,
      toggleSortOrder,
      resetFilters,
      clearErrorMessage,
      refetch,
    ],
  );
}
