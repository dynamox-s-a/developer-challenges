import { Machine } from "@/types/machine";

import { apiSlice } from "../api/apiSlice";

const machinesUrl = '/machines';


export const machinesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMachines: builder.query<Machine[], void>({
      query: () => machinesUrl,
      providesTags: ['Machines'],
    }),

    getMachine: builder.query<Machine, number>({
      query: (id) => `${machinesUrl}/${id}`,
      providesTags: (result, error, id) => [
        { type: 'Machines', id },
        'MonitoringPoints',
        'Sensors'
      ],
      transformResponse: (response: Machine) => {
        // Ensure monitoringPoints is always an array
        return {
          ...response,
          monitoringPoints: Array.isArray(response.monitoringPoints)
            ? response.monitoringPoints
            : []
        };
      },
    }),

    createMachine: builder.mutation<Machine, Partial<Machine>>({
      query: (newMachine) => ({
        url: machinesUrl,
        method: 'POST',
        body: newMachine
      }),
      invalidatesTags: ['Machines'],
    }),

    updateMachine: builder.mutation<Machine, Partial<Machine>>({
      query: ({ id, ...patch }) => ({
        url: `${machinesUrl}/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Machines'],
    }),

    deleteMachine: builder.mutation<void, number>({
      query: (id) => ({
        url: `${machinesUrl}/${id}`,
        method: 'DELETE',
        invalidatesTags: ['Machines'],
      }),
      invalidatesTags: ['Machines'],
    })
  })
})

export const {
  useGetMachinesQuery,
  useGetMachineQuery,
  useCreateMachineMutation,
  useUpdateMachineMutation,
  useDeleteMachineMutation
} = machinesApi;