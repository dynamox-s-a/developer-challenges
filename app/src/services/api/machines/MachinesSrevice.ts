import { IMachine } from "../../../types";
import { Api } from "../ApiConfig";
import { ApiException } from "../ErrorException";

const getAll = async (): Promise<IMachine[] | ApiException> => {
  try {
    const { data } = await Api().get("/machines");
    return data;
  } catch (error: any) {
    return new ApiException(error.message || "Erro ao buscar os registros");
  }
};

const getById = async (id: number): Promise<IMachine | ApiException> => {
  try {
    const { data } = await Api().get(`/machines/${id}}`);
    return data;
  } catch (error: any) {
    return new ApiException(error.message || "Erro ao buscar o registro");
  }
};

const create = async (
  newMachine: Omit<IMachine, "id">,
): Promise<IMachine | ApiException> => {
  try {
    const { data } = await Api().post("/machines", newMachine);
    return data;
  } catch (error: any) {
    return new ApiException(error.message || "Erro ao criar o registro");
  }
};

const updateById = async (
  newMachine: IMachine,
): Promise<IMachine | ApiException> => {
  try {
    const { data } = await Api().put(`/machines/${newMachine.id}}`, newMachine);
    return data;
  } catch (error: any) {
    return new ApiException(error.message || "Erro ao atualizar o registro");
  }
};

const deleteById = async (id: number): Promise<undefined | ApiException> => {
  try {
    await Api().delete(`/machines/${id}}`);
    return;
  } catch (error: any) {
    return new ApiException(error.message || "Erro ao apagar o registro");
  }
};

export const MAchinesService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
