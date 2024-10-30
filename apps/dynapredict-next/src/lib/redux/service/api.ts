import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Machine, MonitoringPoint, Sensor } from '@/types/data-types';
import { authClient } from '@/lib/auth/client';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: async (headers) => {
      const token = authClient.getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Machine', 'MonitoringPoint'],
  endpoints: (builder) => ({
    getMachines: builder.query<Machine[], void>({
      query: () => '/machines',
      providesTags: ['Machine'],
    }),
    getMachineTypes: builder.query<string[], void>({
      query: () => '/machines/types',
    }),
    getMachine: builder.query<Machine, number>({
      query: (id) => `/machines/${id}`,
      providesTags: ['Machine'],
    }),
    addMachine: builder.mutation<Machine, Partial<Machine>>({
      query: (body) => ({
        url: '/machines',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Machine'],
    }),
    updateMachine: builder.mutation<Machine, Partial<Machine> & Pick<Machine, 'id'>>({
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

    // getMonitoringPoints: builder.query<MonitoringPoint[], string>({
    //   query: (machineId) => `/machines/${machineId}/monitoring-points`,
    // }),
    addMonitoringPoint: builder.mutation<MonitoringPoint, Partial<MonitoringPoint> & { machineId: number }>({
      query: ({ machineId, ...body }) => ({
        url: `/machines/${machineId}/monitoring-points`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MonitoringPoint'],
    }),

    assignSensor: builder.mutation<MonitoringPoint, Partial<Sensor> & { pointId: number }>({
      query: ({ pointId, ...body }) => ({
        url: `/monitoring-points/${pointId}/sensors`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MonitoringPoint'],
    }),
  }),
});

export const {
  useGetMachinesQuery,
  useGetMachineQuery,
  useAddMachineMutation,
  useUpdateMachineMutation,
  useDeleteMachineMutation,
  useAddMonitoringPointMutation,
  useAssignSensorMutation,
} = api;
