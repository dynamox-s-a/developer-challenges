import { api } from '../core/libs/axios';
import { MACHINE_PATH } from '../machine/actions';

export const POINTS_PATH = 'by-monitoring-points';
export const DELETE_POINT_PATH = 'delete-point';

export async function getAllMonitoringPoints(userId: string) {
  const response = await api.get(`${MACHINE_PATH}/${POINTS_PATH}/${userId}`);

  return response.data;
}

export async function deleteMonitoringPointAction(params: {
  machineId: string;
  pointId: string;
}) {
  const response = await api.put(
    `${MACHINE_PATH}/${DELETE_POINT_PATH}/${params.machineId}`,
    { monitoringPointId: params.pointId }
  );

  return response.data;
}
