export type UserRole = 'admin' | 'reader';

export type EventCategory = 'Conference' | 'Workshop' | 'Webinar' | 'Networking' | 'Other';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  name: string;
}

export interface Event {
  id: number;
  name: string;
  dateTime: string;
  location: string;
  description: string;
  category: EventCategory;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateEventRequest {
  name: string;
  dateTime: string;
  location: string;
  description: string;
  category: EventCategory;
}

export interface UpdateEventRequest extends CreateEventRequest {
  id: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
}
