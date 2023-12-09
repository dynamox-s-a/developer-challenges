import { IMachine } from "../../../redux/store/machines/types";
import { Api } from "../ApiConfig";

const getAll = () => {
  return Api().get("/machines");
};

const getById = (id: number) => {
  return Api().get(`/machines/${id}}`);
};

const create = (newMachine: Omit<IMachine, "id">) => {
  return Api().post("/machines", newMachine);
};

const updateById = (newMachine: IMachine) => {
  return Api().put(`/machines/${newMachine.id}}`, newMachine);
};

const deleteById = (id: number) => {
  return Api().delete(`/machines/${id}}`);
};

export const MachinesService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
