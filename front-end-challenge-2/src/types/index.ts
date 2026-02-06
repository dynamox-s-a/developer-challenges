export interface User {
  id: number;
  email: string;
  password: string;
  role: "admin" | "reader";
  name: string;
}

export interface Event {
  id?: number;
  name: string;
  date: string;
  location: string;
  description: string;
  category: "Conferência" | "Workshop" | "Webinar" | "Networking" | "Outro";
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

export type CreateEventDto = Omit<Event, "id">;

export type UpdateEventDto = Event & { id: number };
