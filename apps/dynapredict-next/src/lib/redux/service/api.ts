import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  Machine,
  MonitoringPoint,
  PaginatedMonitoringPoints,
  PaginatedMonitoringPointsQuery,
  Sensor,
} from '@/types/data-types';
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
  tagTypes: ['Machine', 'MonitoringPoint', 'PaginatedMonitoringPoints'],
  endpoints: (builder) => ({
    getMachines: builder.query<Machine[], void>({
      query: () => '/machines',
      providesTags: ['Machine'],
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
      invalidatesTags: ['Machine', 'MonitoringPoint', 'PaginatedMonitoringPoints'],
    }),
    deleteMachine: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/machines/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Machine', 'MonitoringPoint', 'PaginatedMonitoringPoints'],
    }),

    getMonitoringPoints: builder.query<MonitoringPoint[], void>({
      query: () => '/monitoring-points',
      providesTags: ['MonitoringPoint'],
    }),
    addMonitoringPoint: builder.mutation<MonitoringPoint, Partial<MonitoringPoint> & { machineId: number }>({
      query: ({ machineId, ...body }) => ({
        url: `/machines/${machineId}/monitoring-points`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MonitoringPoint', 'PaginatedMonitoringPoints'],
    }),

    assignSensor: builder.mutation<MonitoringPoint, Partial<Sensor> & { pointId: number }>({
      query: ({ pointId, ...body }) => ({
        url: `/monitoring-points/${pointId}/sensor`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MonitoringPoint', 'PaginatedMonitoringPoints'],
    }),

    getPaginatedMonitoringPoints: builder.query<PaginatedMonitoringPoints, PaginatedMonitoringPointsQuery>({
      query: ({ page = 1, sortBy = 'machine_name', sortOrder = 'asc' }) => ({
        url: '/monitoring-points/paginated',
        params: { page, sortBy, sortOrder },
      }),
      providesTags: ['PaginatedMonitoringPoints'],
    }),
  }),
});

export const {
  useGetMachinesQuery,
  useGetMachineQuery,
  useGetMonitoringPointsQuery,
  useAddMachineMutation,
  useUpdateMachineMutation,
  useDeleteMachineMutation,
  useAddMonitoringPointMutation,
  useAssignSensorMutation,
  useGetPaginatedMonitoringPointsQuery,
} = api;
