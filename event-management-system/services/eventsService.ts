import { Event } from '@/types/event';

const API_URL = 'http://localhost:3001';

export async function fetchEvents(): Promise<Event[]> {
  const response = await fetch(`${API_URL}/events`);

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
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
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
  });

  if (!response.ok) {
    throw new Error('Failed to delete event');
  }
}