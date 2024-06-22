import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MachineType } from '../../Machines';
import { SensorType } from '../../Sensors';

export type MachinesApiResponse = MachineType[];
export type SensorsApiResponse = SensorType[];

export const machinesApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/' }),
  reducerPath: 'machinesApi',
  tagTypes: ['Machines'],
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    getMachines: build.query<MachinesApiResponse, string>({
      query: (userId: string | number) => `machines/${userId}`,
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
    getSensorsByMachineId: build.query<SensorsApiResponse, string>({
      query: (machineId: string) => `sensors/${machineId}`,
    }),
    createSensor: build.mutation<MachinesApiResponse, Partial<SensorType>>({
      query: (sensor: SensorType) => ({
        url: `sensors`,
        method: 'POST',
        body: sensor,
      }),
    }),
    deleteSensor: build.mutation<MachinesApiResponse, string>({
      query: (sensorId: string) => ({
        url: `sensors/${sensorId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  // MACHINES
  useGetMachinesQuery,
  useUpdateMachineByIdMutation,
  useCreateMachineMutation,
  // SENSORS
  useGetSensorsByMachineIdQuery,
  useCreateSensorMutation,
  useDeleteSensorMutation,
} = machinesApiSlice;
