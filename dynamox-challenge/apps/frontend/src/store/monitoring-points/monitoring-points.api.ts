import { MonitoringPoint } from "@/types/monitoring-point";
import { apiSlice } from "../api/apiSlice";

const monitoringPointsUrl = '/monitoring-points';

export const monitoringPointsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMonitoringPoints: builder.query<MonitoringPoint[], void>({
      query: () => monitoringPointsUrl,
      providesTags: ['MonitoringPoints'],
    }),

    createMonitoringPoint: builder.mutation<MonitoringPoint, Partial<MonitoringPoint>>({
      query: (newMonitoringPoint) => ({
        url: monitoringPointsUrl,
        method: 'POST',
        body: newMonitoringPoint
      }),
      invalidatesTags: ['MonitoringPoints', 'Machines'],
    }),

    updateMonitoringPoint: builder.mutation<MonitoringPoint, Partial<MonitoringPoint>>({
      query: ({ id, ...patch }) => ({
        url: `${monitoringPointsUrl}/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['MonitoringPoints', 'Machines'],
    }),

    deleteMonitoringPoint: builder.mutation<void, number>({
      query: (id) => ({
        url: `${monitoringPointsUrl}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MonitoringPoints', 'Machines'],
    })
  })
})

export const {
  useGetMonitoringPointsQuery,
  useCreateMonitoringPointMutation,
  useUpdateMonitoringPointMutation,
  useDeleteMonitoringPointMutation
} = monitoringPointsApi;
