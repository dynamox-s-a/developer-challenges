import { setEvents } from "@/store/events/slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { EventsServiceImpl } from "./events-service";
import type { EventsService, EventsState } from "./types";

const eventsService: EventsService = new EventsServiceImpl();

export function useEvents() {
	const dispatch = useDispatch();
	const [state, setState] = useState<EventsState>({
		data: [],
		loading: true,
		error: null,
	});

	useEffect(() => {
		const fetchEvents = async () => {
			setState((prev) => ({ ...prev, loading: true }));
			const result = await eventsService.getEvents();
			setState(result);
			dispatch(setEvents(result.data));
		};

		fetchEvents();
	}, [dispatch]);

	return state;
}
