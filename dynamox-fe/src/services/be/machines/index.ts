import { api } from "@/services/api/api";
import ApiServices from "@/constants/api-services";
import { Machines } from "@/store/reducers/machines.reducers";

const url = ApiServices.be;

const getAll = async (): Promise<{ data: Machines[] }> => {
  try {
    return api.get(`${url}/machines`);
  } catch (error) {
    throw error;
  }
};

const create = async (params: {name: string, type: string}): Promise<{ data: Machines }> => {
  try {
    return api.post(`${url}/machines`, params);
  } catch (error) {
    throw error;
  }
};

export default {
  getAll,
  create
};
