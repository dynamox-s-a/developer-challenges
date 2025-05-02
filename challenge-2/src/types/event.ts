export enum EventCategory {
	Conferencia = "Conferência",
	Workshop = "Workshop",
	Webinar = "Webinar",
	Networking = "Networking",
	Outro = "Outro",
}

export interface Event {
	id: string;
	title: string;
	description: string;
	date: string;
	location: string;
	category: EventCategory;
	imageUrl?: string;
}
