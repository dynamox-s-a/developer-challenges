
export interface EventModel {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    category: "conferencia" | "workshop" | "webinar" | "networking" | "outro";
    
};

export type EventCreateDTO = Omit<EventModel, "id">;