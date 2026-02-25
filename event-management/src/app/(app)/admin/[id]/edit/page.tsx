'use client';

import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import EventForm from '../../_components/EventForm';
import { Box } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { updateEvent } from '@/store/slices/eventsSlice';
import { Event } from '@/types/event';

const EditPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const event = useAppSelector((state: RootState) => state.events.events.find((evento) => String(evento.id) === id));

  const handleUpdateEvent = async (data: Event) => {
    await dispatch(updateEvent({ ...data, id })).unwrap();
    router.push('/events');
  };

  if (!event)
    return (
      <Box sx={{ mt: 15 }}>
        <p>Carregando...</p>
      </Box>
    );

  return <EventForm initialData={event} onSubmit={handleUpdateEvent} />;
};

export default EditPage;
