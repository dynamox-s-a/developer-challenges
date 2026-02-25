'use client';
import EventCard from '@/app/(app)/events/_components/Event';
import { AlertColor, Box, Tab, Tabs } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteEvent, fetchEvents } from '@/store/slices/eventsSlice';
import { Event as EventType } from '@/types/event';
import SearchBar from './_components/SearchBar';
import Toast from '@/components/Toast';
import { useRouter } from 'next/navigation';

const Events = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { events } = useAppSelector((state: RootState) => state.events);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [eventsSearch, setEventsSearch] = useState<string>('');
  const [sortName, setSortName] = useState<'date' | 'name'>('date');
  const [sortType, setSortType] = useState<'asc' | 'desc'>('asc');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as AlertColor });

  const userIsAdmin = user?.role === 'admin';

  useEffect(() => {
    dispatch(fetchEvents());
  }, []);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    let filteredEvents: EventType[] = events;
    if (eventsSearch) {
      filteredEvents = events.filter((event: EventType) =>
        event.name.toLowerCase().includes(eventsSearch.toLowerCase()),
      );
    }
    const sortedEvents: EventType[] = filteredEvents.toSorted((a, b) => {
      const direction = sortType === 'asc' ? 1 : -1;
      const comparison =
        sortName === 'date'
          ? new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
          : a.name.localeCompare(b.name);
      return direction * comparison;
    });
    return {
      upcomingEvents: sortedEvents.filter((event: EventType) => new Date(event.dateTime) > new Date()),
      pastEvents: sortedEvents.filter((event: EventType) => new Date(event.dateTime) < new Date()),
    };
  }, [events, eventsSearch, sortName, sortType]);

  const handleDeleteEvent = useCallback(async (id: string) => {
    try {
      await dispatch(deleteEvent(id)).unwrap();
      setToast({ open: true, message: 'Event deleted successfully', severity: 'success' });
    } catch (error) {
      console.error(error);
      setToast({ open: true, message: 'Error deleting event', severity: 'error' });
    }
  }, []);

  const handleCreateEvent = () => {
    router.push('/admin/create');
  };

  return (
    <Box sx={{ mt: 15 }}>
      <SearchBar
        isAdmin={userIsAdmin}
        eventsSearch={eventsSearch}
        setEventsSearch={setEventsSearch}
        sortName={sortName}
        setSortName={setSortName}
        sortType={sortType}
        setSortType={setSortType}
        onCreateEvent={handleCreateEvent}
      />
      <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
        <Tab label="Upcoming Events" />
        <Tab label="Past Events" />
      </Tabs>
      <main>
        {activeTab === 0
          ? upcomingEvents.map((event: EventType) => (
              <EventCard key={event.id} event={event} isAdmin={userIsAdmin} deleteEvent={handleDeleteEvent} />
            ))
          : pastEvents.map((event: EventType) => (
              <EventCard key={event.id} event={event} isAdmin={userIsAdmin} deleteEvent={handleDeleteEvent} />
            ))}
      </main>
      <Toast
        open={toast.open}
        onClose={() => setToast({ open: false, message: '', severity: 'success' })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
};

export default Events;
