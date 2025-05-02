import type { Event, EventCategory } from "@/services/events/types";

export interface EventFormData {
	title: string;
	description: string;
	date: string;
	location: string;
	category: EventCategory;
	imageUrl?: string;
}

export interface EventTableProps {
	events: Event[];
	loading: boolean;
	onEdit: (event: Event | null) => void;
	onDelete: (event: Event | null) => void;
}
