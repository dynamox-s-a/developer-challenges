import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const fetchMachines = async () => {
  const response = await api.get("/machines");
  return response.data;
};

export const addMachine = async (machine) => {
  if (!machine.name || !machine.type) {
    throw new Error("Name and type are required for creating a machine.");
  }

  const response = await api.post("/machines", machine);
  return response.data;
};

export const updateMachine = async (id, machine) => {
  const response = await api.put(`/machines/${id}`, machine);
  return response.data;
};

export const deleteMachine = async (id) => {
  await api.delete(`/machines/${id}`);
};

export const createMonitoringPoint = async (machineId, monitoringPoint) => {
  const response = await api.post(
    `/machines/${machineId}/monitoring-points`,
    monitoringPoint
  );
  return response.data;
};

export const addSensorToMonitoringPoint = async (
  machineId,
  monitoringPointId,
  sensor
) => {
  const response = await api.post(
    `/machines/${machineId}/monitoring-points/${monitoringPointId}/sensors`,
    sensor
  );
  return response.data;
};
export default api;
