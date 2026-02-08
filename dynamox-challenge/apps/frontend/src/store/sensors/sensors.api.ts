import { Sensor, SensorModel } from "@/types/sensor";
import { apiSlice } from "../api/apiSlice";

const sensorsUrl = '/sensors';

export const sensorsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSensors: builder.query<Sensor[], void>({
      query: () => sensorsUrl,
      providesTags: ['Sensors'],
    }),

    getSensorsByMonitoringPoint: builder.query<Sensor[], number>({
      query: (monitoringPointId) => `${sensorsUrl}?monitoringPointId=${monitoringPointId}`,
      providesTags: (result, error, id) => [{ type: 'Sensors', id: `LIST_${id}` }, 'Sensors'],
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
  useGetSensorsByMonitoringPointQuery,
  useCreateSensorMutation,
  useUpdateSensorMutation,
  useDeleteSensorMutation
} = sensorsApi;
