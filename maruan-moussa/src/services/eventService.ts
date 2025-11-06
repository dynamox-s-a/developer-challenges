import { EventCreateDTO, EventModel } from "@/dto/EventModelDto";
import { api } from "./api";


export const getEvents = async (): Promise<EventModel[]> => {
    const response = await api.get("/events");
    return response.data;
};

export const getEventById = async (id: number): Promise<EventModel> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  };

export const createEvent = async (newEvent: EventCreateDTO): Promise<EventModel> => {
    const response = await api.post("/events", newEvent);
    return response.data;
};

export const updateEvent = async (
    id: number,
    updateEvent: EventCreateDTO
) : Promise<EventModel> => {
    const response = await api.put(`events/${id}`, updateEvent);
    return response.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
    await api.delete(`/events/${id}`)
}