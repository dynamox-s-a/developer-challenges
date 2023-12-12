import { IMachine, IPagination, NewMachine } from "../../../redux/store/machines/types";
import { Api } from "../ApiConfig";

const getAll = () => {
  return Api().get("/machines");
};

const getPaged = ({ page, limit }: IPagination) => {
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
  getPaged,
  create,
  update,
  delete: deleteMachine,
};
