import { api } from "@/services/api/api";
import ApiServices from "@/constants/api-services";
import { MonitoringPoints } from "@/components/dashboard/list-monitoring-points/monitoring-points-table";

const url = ApiServices.be;

const getAll = async (): Promise<{ data: MonitoringPoints[] }> => {
  try {
    return api.get(`${url}/monitoring-points`);
  } catch (error) {
    throw error;
  }
};

const create = async (params: {name: string, sensorUUID: string, machineUUID: string}): Promise<{ data: MonitoringPoints }> => {
  try {
    return api.post(`${url}/monitoring-points`, params);
  } catch (error) {
    throw error;
  }
};

export default {
  getAll,
  create
};
