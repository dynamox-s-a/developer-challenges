import { apiRequest } from "@/lib/api";
import type { CreateEventPayload, Event, UpdateEventPayload } from "@/types";

export const eventsApi = {
  async getAll(): Promise<Event[]> {
    return apiRequest<Event[]>("/events");
  },

  async getById(id: string): Promise<Event> {
    return apiRequest<Event>(`/events/${id}`);
  },

  async create(payload: CreateEventPayload): Promise<Event> {
    const now = new Date().toISOString();
    const newEvent = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    return apiRequest<Event>("/events", {
      method: "POST",
      body: JSON.stringify(newEvent),
    });
  },

  async update(payload: UpdateEventPayload): Promise<Event> {
    const { id, ...updates } = payload;
    const existing = await eventsApi.getById(id);

    const updatedEvent = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return apiRequest<Event>(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedEvent),
    });
  },

  async delete(id: string): Promise<void> {
    await apiRequest(`/events/${id}`, {
      method: "DELETE",
    });
  },
};
