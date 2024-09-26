import { http } from "./http.ts";

type ILoginUser = {
  email: string;
  password: string;
};
export async function loginService(credential: ILoginUser) {
  return await http.post(`/login/`, credential);
}
