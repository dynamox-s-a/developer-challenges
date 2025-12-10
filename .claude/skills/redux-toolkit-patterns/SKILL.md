---
name: redux-toolkit-patterns
description: Implement Redux Toolkit state management with createSlice, createAsyncThunk, RTK Query, and TypeScript. Use when setting up Redux store, creating slices, managing async state, implementing CRUD operations, or integrating Redux with React components in Next.js applications.
---

# Redux Toolkit State Management

## Overview

This skill provides patterns for implementing Redux Toolkit in Next.js applications with TypeScript, focusing on modern best practices and type safety.

## Store Setup for Next.js

### Store Configuration

```tsx
// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import eventsReducer from './slices/eventsSlice';
import authReducer from './slices/authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      events: eventsReducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types for date handling
          ignoredActions: ['events/setFilter'],
          ignoredPaths: ['events.filters.dateRange'],
        },
      }),
  });
};

// Types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Store Provider for Next.js App Router

```tsx
// store/StoreProvider.tsx
'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
```

### Integration in Root Layout

```tsx
// app/layout.tsx
import StoreProvider from '@/store/StoreProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
```

## Slice Patterns

### Basic Slice with TypeScript

```tsx
// store/slices/eventsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  category: 'Conference' | 'Workshop' | 'Webinar' | 'Networking' | 'Other';
}

interface EventsState {
  items: Event[];
  selectedEvent: Event | null;
  filters: {
    search: string;
    category: string | null;
    sortBy: 'date' | 'name';
    sortOrder: 'asc' | 'desc';
  };
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  items: [],
  selectedEvent: null,
  filters: {
    search: '',
    category: null,
    sortBy: 'date',
    sortOrder: 'asc',
  },
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.items = action.payload;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.items.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.items.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((e) => e.id !== action.payload);
    },
    setSelectedEvent: (state, action: PayloadAction<Event | null>) => {
      state.selectedEvent = action.payload;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.category = action.payload;
    },
    setSorting: (
      state,
      action: PayloadAction<{ sortBy: 'date' | 'name'; sortOrder: 'asc' | 'desc' }>
    ) => {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortOrder = action.payload.sortOrder;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  setSelectedEvent,
  setSearchFilter,
  setCategoryFilter,
  setSorting,
  setLoading,
  setError,
} = eventsSlice.actions;

export default eventsSlice.reducer;
```

### Async Thunks Pattern

```tsx
// store/slices/eventsSlice.ts (continued)
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosInstance } from '@/lib/api';

// Fetch all events
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<Event[]>('/events');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create event
export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (event: Omit<Event, 'id'>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<Event>('/events', event);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue((error as Error).message);
    }
  }
);

// Update event
export const updateEventAsync = createAsyncThunk(
  'events/updateEventAsync',
  async (event: Event, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<Event>(`/events/${event.id}`, event);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue((error as Error).message);
    }
  }
);

// Delete event
export const deleteEventAsync = createAsyncThunk(
  'events/deleteEventAsync',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/events/${id}`);
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue((error as Error).message);
    }
  }
);

// Add extraReducers to handle async states
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    // ... sync reducers
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create event
      .addCase(createEvent.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update event
      .addCase(updateEventAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete event
      .addCase(deleteEventAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => e.id !== action.payload);
      });
  },
});
```

## Selectors

### Memoized Selectors with Reselect

```tsx
// store/selectors/eventsSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Base selectors
const selectEventsState = (state: RootState) => state.events;
const selectEventItems = (state: RootState) => state.events.items;
const selectFilters = (state: RootState) => state.events.filters;

// Filtered and sorted events
export const selectFilteredEvents = createSelector(
  [selectEventItems, selectFilters],
  (events, filters) => {
    let filtered = [...events];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter((event) => event.category === filters.category);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        comparison = a.name.localeCompare(b.name);
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }
);

// Upcoming events (future dates only)
export const selectUpcomingEvents = createSelector(
  [selectFilteredEvents],
  (events) => {
    const now = new Date();
    return events.filter((event) => new Date(event.date) >= now);
  }
);

// Past events
export const selectPastEvents = createSelector(
  [selectFilteredEvents],
  (events) => {
    const now = new Date();
    return events.filter((event) => new Date(event.date) < now);
  }
);

// Events by category
export const selectEventsByCategory = createSelector(
  [selectEventItems],
  (events) => {
    return events.reduce(
      (acc, event) => {
        if (!acc[event.category]) {
          acc[event.category] = [];
        }
        acc[event.category].push(event);
        return acc;
      },
      {} as Record<string, typeof events>
    );
  }
);

// Loading and error states
export const selectEventsLoading = (state: RootState) => state.events.loading;
export const selectEventsError = (state: RootState) => state.events.error;
```

## Component Integration

### Using Redux in Components

```tsx
// components/EventList.tsx
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  fetchEvents,
  setSearchFilter,
  setSorting,
} from '@/store/slices/eventsSlice';
import {
  selectFilteredEvents,
  selectEventsLoading,
  selectEventsError,
} from '@/store/selectors/eventsSelectors';
import { CircularProgress, Alert } from '@mui/material';

export function EventList() {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectFilteredEvents);
  const loading = useAppSelector(selectEventsLoading);
  const error = useAppSelector(selectEventsError);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleSearch = (value: string) => {
    dispatch(setSearchFilter(value));
  };

  const handleSort = (sortBy: 'date' | 'name', sortOrder: 'asc' | 'desc') => {
    dispatch(setSorting({ sortBy, sortOrder }));
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
```

## Auth Slice Pattern

```tsx
// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosInstance } from '@/lib/api';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'reader';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get<(User & { password: string })[]>('/users');
      const users = response.data;

      const user = users.find(
        (u) =>
          u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Generate fake JWT token
      const token = btoa(
        JSON.stringify({
          userId: user.id,
          email: user.email,
          role: user.role,
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        })
      );

      localStorage.setItem('token', token);

      return {
        user: { id: user.id, email: user.email, role: user.role },
        token,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue((error as Error).message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
```

## Best Practices

1. **Use TypeScript** - Define types for state, actions, and payloads
2. **Normalize state** - Avoid deeply nested structures
3. **Use createSelector** - Memoize derived data
4. **Keep slices focused** - One slice per feature/domain
5. **Use typed hooks** - useAppDispatch and useAppSelector
6. **Handle loading/error states** - Consistent async state management
7. **Server Component consideration** - Redux is for client components only
8. **Use axios with interceptors** - Centralize auth and error handling
9. **Use axios.isAxiosError()** - Properly type-guard axios errors in thunks
