import {
  LoginRequest,
  LoginResponse,
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  User,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new ApiError(
      response.status,
      error.message || `Error: ${response.statusText}`,
    );
  }
  return response.json();
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return handleResponse<LoginResponse>(response);
}

export async function verifyToken(
  token: string,
): Promise<{ valid: boolean; user: User }> {
  const response = await fetch(`${API_URL}/auth/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<{ valid: boolean; user: User }>(response);
}

export async function fetchEvents(): Promise<Event[]> {
  const response = await fetch(`${API_URL}/events`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Event[]>(response);
}

export async function createEvent(event: CreateEventRequest): Promise<Event> {
  const newEvent = {
    ...event,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(newEvent),
  });
  return handleResponse<Event>(response);
}

export async function updateEvent(event: UpdateEventRequest): Promise<Event> {
  const { id, ...eventData } = event;
  const updatedEvent = {
    ...eventData,
    updatedAt: new Date().toISOString(),
  };

  const response = await fetch(`${API_URL}/events/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedEvent),
  });
  return handleResponse<Event>(response);
}

export async function deleteEvent(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new ApiError(
      response.status,
      error.message || `Error: ${response.statusText}`,
    );
  }
}
