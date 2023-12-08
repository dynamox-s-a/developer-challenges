import { Api } from "../ApiConfig";

const getByEmail = async (email: string, password: string) => {
  return Api().get(`/users?email=${email}&password=${password}`);
};

export const UsersService = {
  getByEmail,
};
