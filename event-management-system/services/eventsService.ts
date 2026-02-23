import { Event } from '@/types/event';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getAuthHeaders() {
  const auth = localStorage.getItem('auth');
  const token = auth ? JSON.parse(auth).token : null;

  return {
    'Content-Type': 'application/json',
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };
}

export async function fetchEvents(): Promise<Event[]> {
  const response = await fetch(`${API_URL}/events`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  return response.json();
}

export async function createEvent(
  data: Omit<Event, 'id'>
): Promise<Event> {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create event');
  }

  return response.json();
}

export async function updateEvent(
  id: number,
  data: Omit<Event, 'id'>
): Promise<Event> {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update event');
  }

  return response.json();
}

export async function deleteEvent(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete event');
  }
}