import { setEvents } from "@/store/events/slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EventsServiceImpl } from "./events-service";
import type { EventsService, EventsState } from "./types";
import type { RootState } from "@/store";

const eventsService: EventsService = new EventsServiceImpl();

export function useEvents() {
	const dispatch = useDispatch();
	const existingEvents = useSelector((state: RootState) => state.events.items);
	const [state, setState] = useState<EventsState>({
		data: existingEvents,
		loading: existingEvents.length === 0,
		error: null,
	});

	useEffect(() => {
		if (existingEvents.length > 0) {
			return;
		}

		const fetchEvents = async () => {
			setState((prev) => ({ ...prev, loading: true }));
			const result = await eventsService.getEvents();
			setState(result);
			dispatch(setEvents(result.data));
		};

		fetchEvents();
	}, [dispatch, existingEvents.length]);

	return state;
}
