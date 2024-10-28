import { toast } from "react-toastify";
import AxiosAuth from "@/app/axios/AuthAxios";

export interface AuthCredentials {
  email: string;
  password: string;
}

export async function register(credentials: AuthCredentials) {
  return AxiosAuth()
    .post("/register", credentials)
    .then((response) => {
      if (response.status == 201) {
        toast.success("User succefully created!");
      }
      return response;
    })
    .catch((error) => {
      toast.error(error.response.data.message);
      return error.response;
    });
}

export async function login(credentials: AuthCredentials) {
  return AxiosAuth()
    .post("/login", credentials)
    .then((response) => {
      localStorage.setItem("token", response.data.token);

      return response;
    })
    .catch((error) => {
      toast.error(error.response.data.message);
      return error.response;
    });
}
