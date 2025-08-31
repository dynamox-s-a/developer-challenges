import { api } from "../config/api";
import type { MachineType } from "../types/MachineType";

export const getListMachineType = async (): Promise<MachineType[]> => {
  const response = await api.get<{ machineTypes: MachineType[] }>("/MachineType");
  return response.data.machineTypes;
};