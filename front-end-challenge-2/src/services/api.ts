import axios from "axios";
import { getAuthToken } from "@/utils/auth";
import { Event, CreateEventDto, UpdateEventDto } from "@/types";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.get(
      `/users?email=${email}&password=${password}`,
    );
    return response.data[0];
  },

  getUserById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

export const eventsService = {
  getAll: async (): Promise<Event[]> => {
    const response = await api.get("/events");
    return response.data;
  },

  getById: async (id: number): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  create: async (event: CreateEventDto): Promise<Event> => {
    const response = await api.post("/events", event);
    return response.data;
  },

  update: async (id: number, event: UpdateEventDto): Promise<Event> => {
    const response = await api.put(`/events/${id}`, event);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};
