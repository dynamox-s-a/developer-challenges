import { Api } from "../ApiConfig";
import { IUserLogin } from "./../../../redux/store/users/types";

const getByEmail = async ({ email, password }: IUserLogin) => {
  return Api().get(`/users?email=${email}&password=${password}`);
};

export const UsersService = {
  getByEmail,
};
