import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MachineType } from '../../Machines';
import { SensorType } from '../../Sensors';

export type MachinesApiResponse = MachineType[];
export type SensorsApiResponse = SensorType[];
export type LoginApiResponse = {
  id: string;
  email: string;
  name: string;
};

export type LoginType = {
  password: string;
  email: string;
};

export type SignInType = {
  name: string;
  password: string;
  email: string;
};

export const machinesApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/' }),
  reducerPath: 'Api',
  tagTypes: ['Machines', 'Sensors', 'Login'],
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    // ===== MONITOR POINTS =====
    getAllMonitorPoints: build.query<SensorsApiResponse, string>({
      query: (userId: string) => `monitor/${userId}`,
    }),
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
    deleteMachine: build.mutation<MachinesApiResponse, string>({
      query: (machineId: string) => ({
        url: `machines/${machineId}`,
        method: 'DELETE',
      }),
    }),
    // ===== SENSORS =====
    createSensor: build.mutation<SensorsApiResponse, Partial<SensorType>>({
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
    deleteSensor: build.mutation<SensorsApiResponse, string>({
      query: (sensorId: string) => ({
        url: `sensors/${sensorId}`,
        method: 'DELETE',
      }),
    }),
    // ===== Login =====
    login: build.mutation<LoginApiResponse, LoginType>({
      query: (user: LoginType) => ({
        url: `login`,
        method: 'POST',
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json' }, // required
      }),
    }),
    signIn: build.mutation<LoginApiResponse, SignInType>({
      query: (user: SignInType) => ({
        url: `users`,
        method: `POST`,
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json' }, // required
      }),
    }),
  }),
});

export const {
  // MONITOR POINTS
  useGetAllMonitorPointsQuery,
  // MACHINES
  useCreateMachineMutation,
  useGetMachinesQuery,
  useUpdateMachineByIdMutation,
  useDeleteMachineMutation,
  // SENSORS
  useCreateSensorMutation,
  useGetSensorsByMachineIdQuery,
  useUpdateSensorByIdMutation,
  useDeleteSensorMutation,
  // LOGIN & SIGNUP
  useLoginMutation,
  useSignInMutation,
} = machinesApiSlice;
