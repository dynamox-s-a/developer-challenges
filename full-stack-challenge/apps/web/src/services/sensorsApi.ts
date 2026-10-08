import type { SensorDto, SensorInput } from '@dynapredict/shared-types';
import { apiClient } from './apiClient';

/**
 * Fails with 409 if the serial number is taken or the point already has a
 * sensor, and with 422 if the machine type forbids the model.
 */
export async function attachSensor(
  pointId: string,
  input: SensorInput,
): Promise<SensorDto> {
  const { data } = await apiClient.post<SensorDto>(
    `/monitoring-points/${pointId}/sensor`,
    input,
  );
  return data;
}

/** Hard delete; the sensor's readings go with it. */
export async function removeSensor(sensorId: string): Promise<void> {
  await apiClient.delete(`/sensors/${sensorId}`);
}
