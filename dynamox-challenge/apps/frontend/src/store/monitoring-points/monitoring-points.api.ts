import { MonitoringPoint } from "@/types/monitoring-point";
import { apiSlice } from "../api/apiSlice";

const monitoringPointsUrl = '/monitoring-points';

// Define pagination response type
export interface PaginatedMonitoringPoints {
  data: MonitoringPoint[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MonitoringPointsQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const monitoringPointsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMonitoringPoints: builder.query<PaginatedMonitoringPoints, MonitoringPointsQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

        return `${monitoringPointsUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      providesTags: ['MonitoringPoints'],
    }),

    getMonitoringPoint: builder.query<MonitoringPoint, number>({
      query: (id) => `${monitoringPointsUrl}/${id}`,
      providesTags: (result, error, id) => [{ type: 'MonitoringPoints', id }],
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
  useGetMonitoringPointQuery,
  useCreateMonitoringPointMutation,
  useUpdateMonitoringPointMutation,
  useDeleteMonitoringPointMutation
} = monitoringPointsApi;
