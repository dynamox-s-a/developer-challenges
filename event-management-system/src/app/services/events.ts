import api from "../api/api";
import { EventCategory } from "../types/EventCategory";

export interface Event {
  id?: number;
  title: string;
  date: string;
  location: string;
  description: string;
  category: EventCategory;
}

export const getEvents = async () => {
  const response = await api.get<Event[]>("/events");
  return response.data;
};

export const postEvent = async (event: Event) => {
  const response = await api.post<Event>("/events", event);
  return response.data;
};

export const updateEvent = async (id: number, event: Event) => {
  const response = await api.put<Event>(`/events/${id}`, event);
  return response.data;
};

export const patchEvent = async (id: number, partialEvent: Partial<Event>) => {
  const response = await api.patch<Event>(`/events/${id}`, partialEvent);
  return response.data;
};

export const deleteEvent = async (id: number) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};
