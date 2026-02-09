import { api } from "../api";

export type MachineType = "Pump" | "Fan";

export type Machine = {
  id: string;
  name: string;
  type: MachineType;
  createdAt: string;
  updatedAt: string;
};

export async function fetchMachines() {
  const { data } = await api.get<Machine[]>("/machines");
  return data;
}

export async function createMachine(payload: { name: string; type: MachineType }) {
  const { data } = await api.post<Machine>("/machines", payload);
  return data;
}

export async function updateMachine(id: string, payload: { name?: string; type?: MachineType }) {
  const { data } = await api.patch<Machine>(`/machines/${id}`, payload);
  return data;
}

export async function deleteMachine(id: string) {
  await api.delete(`/machines/${id}`);
}
