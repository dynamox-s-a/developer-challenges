import { IMachine, NewMachine } from "../../../redux/store/machines/types";
import { IPagination } from "../../../types";
import { Api } from "../ApiConfig";

const getAll = ({ page, limit }: IPagination) => {
  return Api().get(`/machines?_page=${page || 1}&_limit=${limit || 5}`);
};

const create = (newMachine: NewMachine) => {
  return Api().post("/machines", newMachine);
};

const update = (newMachine: IMachine) => {
  return Api().put(`/machines/${newMachine.id}`, newMachine);
};

const deleteMachine = (id: number) => {
  return Api().delete(`/machines/${id}`);
};

export const MachinesService = {
  getAll,
  create,
  update,
  delete: deleteMachine,
};
