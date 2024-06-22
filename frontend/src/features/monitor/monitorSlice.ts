import { MachineType } from '../../MachineCard';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type MachinesApiResponse = MachineType[];

export const machinesApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/' }),
  reducerPath: 'machinesApi',
  tagTypes: ['Machines'],
  endpoints: (build) => ({
    getMachines: build.query<MachinesApiResponse, string>({
      query: (userId: string | number) => `machines/${userId}`,
    }),
    getMachineById: build.query<MachinesApiResponse, string>({
      query: (machineId: string) => `${machineId}`,
    }),
    updateMachineById: build.mutation<
      MachinesApiResponse,
      Partial<MachineType>
    >({
      query: (machine: MachineType) => ({
        url: `machines/${machine.id}`,
        method: 'PATCH',
        body: machine,
      }),
    }),
    createMachine: build.mutation<MachinesApiResponse, Partial<MachineType>>({
      query: (machine: MachineType) => ({
        url: `machines`,
        method: 'POST',
        body: machine,
      }),
    }),
  }),
});

export const {
  useGetMachinesQuery,
  useGetMachineByIdQuery,
  useUpdateMachineByIdMutation,
  useCreateMachineMutation,
} = machinesApiSlice;
