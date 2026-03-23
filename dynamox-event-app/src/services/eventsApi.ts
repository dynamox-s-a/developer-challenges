import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Event } from '@/types/event';

export const eventsApi = createApi({
  reducerPath: 'eventsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: '/api'
  }),

  tagTypes: ['Events'],

  endpoints: builder => ({

    getEvents: builder.query<Event[], void>({
      query: () => '/events',
      providesTags: ['Events']
    }),

    createEvent: builder.mutation<Event, Omit<Event, 'id'>>({
      query: event => ({
        url: '/events',
        method: 'POST',
        body: event
      }),
      invalidatesTags: ['Events']
    }),

    updateEvent: builder.mutation<Event, { id: string; event: Omit<Event, 'id'> }>({
      query: ({ id, event }) => ({
        url: `/events/${id}`,
        method: 'PATCH',
        body: event
      }),
      invalidatesTags: ['Events']
    }),

    deleteEvent: builder.mutation<void, string>({
      query: id => ({
        url: `/events/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Events']
    })

  })
});

export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation
} = eventsApi;