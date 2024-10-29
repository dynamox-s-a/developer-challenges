import { api } from "@/services/api/api";
import ApiServices from "@/constants/api-services";
import { LoginCredentials } from "@/types/login"; 

const url = ApiServices.auth;

const login = async (
  params: LoginCredentials
): Promise<{ data: { accessToken: string} }> => {
  try {
    return api.post(`${url}/login`, params);
  } catch (error) {
    console.error("Error when trying to login:", error);
    throw error;
  }
};

export default {
  login,
};
