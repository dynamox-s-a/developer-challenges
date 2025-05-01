import { setEvents } from "@/store/events/slice";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EventsServiceImpl } from "./events-service";
import type { EventsService, EventFilters } from "./types";
import type { RootState } from "@/store";

const eventsService: EventsService = new EventsServiceImpl();

export function useEvents() {
	const dispatch = useDispatch();
	const { items, loading, error } = useSelector(
		(state: RootState) => state.events
	);

	const fetchEvents = useCallback(
		async (filters?: EventFilters) => {
			try {
				const data = await eventsService.getEvents(filters);
				dispatch(setEvents(data.data));
			} catch (error) {
				console.error("Error fetching events:", error);
			}
		},
		[dispatch]
	);

	useEffect(() => {
		if (items.length === 0) {
			fetchEvents();
		}
	}, [items.length, fetchEvents]);

	return {
		items,
		loading,
		error,
		fetchEvents,
		service: eventsService,
	};
}
