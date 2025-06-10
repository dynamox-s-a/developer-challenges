import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  Machine,
} from '@/types/machine';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  tagTypes: ['Machine'],
  endpoints: (builder) => ({
    getMachines: builder.query<Machine[], undefined>({
      query: () => '/machines',
      providesTags: ['Machine'],
    }),
    getMachine: builder.query<Machine, number>({
      query: (id) => `/machines/${id}`,
      providesTags: ['Machine'],
    }),
    postMachine: builder.mutation<Machine, Partial<Machine>>({
      query: (body) => ({
        url: '/machines',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Machine'],
    }),
    patchMachine: builder.mutation<Machine, Partial<Machine> & Pick<Machine, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/machines/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Machine'],
    }),
    deleteMachine: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/machines/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Machine'],
    }),
  }),
});

export const {
  useGetMachinesQuery,
  useGetMachineQuery,
  usePostMachineMutation,
  usePatchMachineMutation,
  useDeleteMachineMutation,
} = api;
