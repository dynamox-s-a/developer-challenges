import { Event, EventCreate } from '@/types/event';

export const getEventsService = async () => {
  const response = await fetch('http://localhost:3001/events', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  const data = await response.json();
  return data;
};

export const deleteEventService = async (id: string) => {
  const response = await fetch(`http://localhost:3001/events/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  const data = await response.json();
  return data;
};

export const createEventService = async (event: EventCreate) => {
  const response = await fetch('http://localhost:3001/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(event),
  });
  const data = await response.json();
  return data;
};

export const updateEventService = async (event: Event) => {
  const response = await fetch(`http://localhost:3001/events/${event.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(event),
  });
  const data = await response.json();
  return data;
};
