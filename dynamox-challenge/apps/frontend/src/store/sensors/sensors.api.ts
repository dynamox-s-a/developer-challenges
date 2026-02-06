import { Sensor, SensorModel } from "@/types/sensor";
import { apiSlice } from "../api/apiSlice";

const sensorsUrl = '/sensors';

export const sensorsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSensors: builder.query<Sensor[], void>({
      query: () => sensorsUrl,
      providesTags: ['Sensors'],
    }),

    createSensor: builder.mutation<Sensor, { model: SensorModel; monitoringPointId: number }>({
      query: (newSensor) => ({
        url: sensorsUrl,
        method: 'POST',
        body: newSensor
      }),
      invalidatesTags: ['Sensors', 'MonitoringPoints', 'Machines'],
    }),

    updateSensor: builder.mutation<Sensor, Partial<Sensor> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `${sensorsUrl}/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Sensors', 'MonitoringPoints', 'Machines'],
    }),

    deleteSensor: builder.mutation<void, number>({
      query: (id) => ({
        url: `${sensorsUrl}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sensors', 'MonitoringPoints', 'Machines'],
    })
  })
})

export const {
  useGetSensorsQuery,
  useCreateSensorMutation,
  useUpdateSensorMutation,
  useDeleteSensorMutation
} = sensorsApi;
