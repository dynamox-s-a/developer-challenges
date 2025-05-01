import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EventsServiceImpl } from "@/services/events/events-service";
import type { RootState } from "@/store";
import { setEvents, setError, setSearchTerm, setSort, setLoading } from "@/store/events/slice";

const eventsService = new EventsServiceImpl();

export function useEventsStore() {
  const dispatch = useDispatch();
  const { items, filteredItems, filters, loading, error } = useSelector(
    (state: RootState) => state.events,
  );
  const initialized = useRef(false);

  const fetchEvents = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const { data } = await eventsService.getEvents();
      dispatch(setEvents(data));
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error ? error.message : "Failed to fetch events",
        ),
      );
    }
  }, [dispatch]);

  const updateSort = useCallback(
    (by: "date" | "title", order: "asc" | "desc") => {
      dispatch(setSort({ by, order }));
    },
    [dispatch],
  );

  const updateSearch = useCallback(
    (search: string) => {
      dispatch(setSearchTerm(search));
    },
    [dispatch],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchEvents();
    }
  }, []);

  return {
    events: filteredItems,
    allEvents: items,
    filters,
    loading,
    error,
    updateSort,
    updateSearch,
    refetch: fetchEvents,
  };
}
