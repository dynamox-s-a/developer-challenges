import { IMachine } from "../../../redux/store/machines/types";
import { IPagination } from "../../../types";
import { Api } from "../ApiConfig";

const getAll = ({ page, limit }: IPagination) => {
  return Api().get(`/machines?_page=${page || 1}&_limit=${limit || 5}`);
};

const create = (newMachine: Omit<IMachine, "id">) => {
  return Api().post("/machines", newMachine);
};

const updateById = (newMachine: IMachine) => {
  return Api().put(`/machines/${newMachine.id}`, newMachine);
};

const deleteById = (id: number) => {
  return Api().delete(`/machines/${id}`);
};

export const MachinesService = {
  getAll,
  create,
  updateById,
  deleteById,
};
