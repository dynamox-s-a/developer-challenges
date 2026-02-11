import eventsReducer, { 
  fetchEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  clearError 
} from '@/store/slices/eventsSlice';
import { EventsState, Event } from '@/types';

describe('eventsSlice', () => {
  const initialState: EventsState = {
    events: [],
    loading: false,
    error: null,
  };

  const mockEvent: Event = {
    id: 1,
    name: 'Test Event',
    dateTime: '2026-03-15T09:00:00',
    location: 'Test Location',
    description: 'Test description with more than fifty characters to meet the minimum requirement',
    category: 'Conference',
    createdAt: '2026-02-01T10:00:00',
    updatedAt: '2026-02-01T10:00:00',
  };

  it('should return the initial state', () => {
    expect(eventsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearError', () => {
    const previousState: EventsState = {
      ...initialState,
      error: 'Some error',
    };

    expect(eventsReducer(previousState, clearError())).toEqual(initialState);
  });

  describe('fetchEvents', () => {
    it('should handle fetchEvents.pending', () => {
      const actual = eventsReducer(initialState, { type: fetchEvents.pending.type });
      expect(actual.loading).toBe(true);
      expect(actual.error).toBe(null);
    });

    it('should handle fetchEvents.fulfilled', () => {
      const events = [mockEvent];
      const actual = eventsReducer(initialState, {
        type: fetchEvents.fulfilled.type,
        payload: events,
      });

      expect(actual.loading).toBe(false);
      expect(actual.events).toEqual(events);
    });

    it('should handle fetchEvents.rejected', () => {
      const actual = eventsReducer(initialState, {
        type: fetchEvents.rejected.type,
        payload: 'Failed to fetch',
      });

      expect(actual.loading).toBe(false);
      expect(actual.error).toBe('Failed to fetch');
    });
  });

  describe('createEvent', () => {
    it('should handle createEvent.fulfilled', () => {
      const actual = eventsReducer(initialState, {
        type: createEvent.fulfilled.type,
        payload: mockEvent,
      });

      expect(actual.loading).toBe(false);
      expect(actual.events).toContainEqual(mockEvent);
    });
  });

  describe('updateEvent', () => {
    it('should handle updateEvent.fulfilled', () => {
      const previousState: EventsState = {
        ...initialState,
        events: [mockEvent],
      };

      const updatedEvent = { ...mockEvent, name: 'Updated Event' };
      const actual = eventsReducer(previousState, {
        type: updateEvent.fulfilled.type,
        payload: updatedEvent,
      });

      expect(actual.events[0].name).toBe('Updated Event');
    });
  });

  describe('deleteEvent', () => {
    it('should handle deleteEvent.fulfilled', () => {
      const previousState: EventsState = {
        ...initialState,
        events: [mockEvent],
      };

      const actual = eventsReducer(previousState, {
        type: deleteEvent.fulfilled.type,
        payload: mockEvent.id,
      });

      expect(actual.events).toHaveLength(0);
    });
  });
});
