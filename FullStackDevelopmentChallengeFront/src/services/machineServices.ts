// services/machineService.ts
import { api } from "../config/api";
import { type Machine } from "../types/Machine";

export const createMachine = (machine: Machine) => {
  return api.post("/", machine);
};
export const getByIdMachine = (machine: Machine) => {
  return api.post(`/${machine.machineTypeId}`);
};
export const getListMachine = () => {
  return api.get("/");
};