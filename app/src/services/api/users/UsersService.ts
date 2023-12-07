import { IUser } from "../../../types";
import { Api } from "../ApiConfig";
import { ApiException } from "../ErrorException";

const getById = async (id: number): Promise<IUser | ApiException> => {
  try {
    const { data } = await Api().get(`/users/${id}}`);
    return data;
  } catch (error: any) {
    return new ApiException(error.message || "Erro ao buscar o registro");
  }
};

export const UsersService = {
  getById,
};
