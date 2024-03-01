import { api } from '../core/libs/axios/api';
import { PageRequest } from '../core/types/page-request';
import { PageResponse } from '../core/types/page-response';
import { SensorType } from './types/sensor-type';

export const SENSOR_PATH = 'sensors';

export default async function getAllSensors({ ...params }: PageRequest) {
  const response = await api.get(SENSOR_PATH, { params });
  const remoteSensorList = response.data.data;
  const pageable: PageResponse<SensorType> = {
    page: params.page,
    size: params?.size || 1,
    totalPages: response.data.total / (params.size || 1),
    total: response.data.total,
    data: remoteSensorList,
  };
  return pageable;
}
