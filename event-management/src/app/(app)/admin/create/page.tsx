'use client';

import { useRouter } from 'next/navigation';
import { createEvent } from '@/store/slices/eventsSlice';
import { useAppDispatch } from '@/store/hooks';
import EventForm from '../_components/EventForm';
import { EventCreate } from '@/types/event';

const CreateEventForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleCreateEvent = async (data: EventCreate) => {
    await dispatch(createEvent(data)).unwrap();
    router.push('/events');
  };

  return <EventForm onSubmit={handleCreateEvent} />;
};

export default CreateEventForm;
