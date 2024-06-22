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
    // ===== MACHINES =====
    createMachine: build.mutation<MachinesApiResponse, Partial<MachineType>>({
      query: (machine: MachineType) => ({
        url: `machines`,
        method: 'POST',
        body: machine,
      }),
    }),
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
    // ===== SENSORS =====
    createSensor: build.mutation<MachinesApiResponse, Partial<SensorType>>({
      query: (sensor: SensorType) => ({
        url: `sensors`,
        method: 'POST',
        body: sensor,
      }),
    }),
    getSensorsByMachineId: build.query<SensorsApiResponse, string>({
      query: (machineId: string) => `sensors/${machineId}`,
    }),
    updateSensorById: build.mutation<SensorsApiResponse, Partial<SensorType>>({
      query: (sensor: SensorType) => ({
        url: `sensors/${sensor.id}`,
        method: 'PATCH',
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
  useCreateMachineMutation,
  useGetMachinesQuery,
  useUpdateMachineByIdMutation,
  // SENSORS
  useCreateSensorMutation,
  useGetSensorsByMachineIdQuery,
  useUpdateSensorByIdMutation,
  useDeleteSensorMutation,
} = machinesApiSlice;
