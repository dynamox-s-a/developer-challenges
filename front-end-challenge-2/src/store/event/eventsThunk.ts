import { createAsyncThunk } from "@reduxjs/toolkit";
import { eventsService } from "@/services/api";
import { Event, CreateEventDto } from "@/types";

export const fetchEvents = createAsyncThunk("events/fetchAll", async () => {
  const events = await eventsService.getAll();
  return events;
});

export const createEvent = createAsyncThunk(
  "events/create",
  async (eventData: CreateEventDto) => {
    const newEvent = await eventsService.create(eventData);
    return newEvent;
  },
);

export const updateEvent = createAsyncThunk(
  "events/update",
  async ({ id, eventData }: { id: number; eventData: Omit<Event, "id"> }) => {
    const updatedEvent = await eventsService.update(id, { id, ...eventData });
    return updatedEvent;
  },
);

export const deleteEvent = createAsyncThunk(
  "events/delete",
  async (id: number) => {
    await eventsService.delete(id);
    return id;
  },
);
