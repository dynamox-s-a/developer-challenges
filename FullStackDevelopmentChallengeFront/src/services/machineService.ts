// services/machineService.ts
import { api } from "../config/api";
import type { CreateMachineRequest } from "../types/CreateMachineRequest";
import { type Machine } from "../types/Machine";
import type { MachineResponse } from "../types/MachineResponse";

export const createMachine = (machine: CreateMachineRequest) => {
  return api.post("/Machine/", machine);
};
export const getByIdMachine = async(id: string) : Promise<MachineResponse>  => {
  const response = await api.get<Machine>(`/Machine/${id}`);
  return response.data;
};

export const getListMachine = async (): Promise<MachineResponse[]> => {
  const response = await api.get<{ machines: MachineResponse[] }>("/Machine");
  return response.data.machines;
};
