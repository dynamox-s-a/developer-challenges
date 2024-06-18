import { MachineType } from '../../MachineCard';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type MachinesApiResponse = MachineType[];

export const machinesApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/machines/' }),
  reducerPath: 'machinesApi',
  tagTypes: ['Machines'],
  endpoints: (build) => ({
    getMachines: build.query<MachinesApiResponse, string>({
      query: (userId: string | number) => `${userId}`,
    }),
  }),
});

export const { useGetMachinesQuery } = machinesApiSlice;
