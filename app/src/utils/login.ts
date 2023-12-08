import { UsersService } from "../services/api/users/UsersService";

export const login = async (loginEmail: string, loginPassword: string) => {
  await UsersService.getByEmail(loginEmail, loginPassword)
    .then(({ data }) => {
      if (data) {
        return;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
