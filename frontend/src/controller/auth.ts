import { User } from "@/types/user";
import { httpClient } from "@/utils/httpClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginController = async (
  email: string,
  password: string,
): Promise<void> => {
  return httpClient<void>(`${API_URL}/auth/login`, "POST", { email, password });
};

export const logoutController = async (): Promise<void> => {
  return httpClient<void>(`${API_URL}/auth/logout`, "POST");
};

export const getMeController = async (): Promise<User | null> => {
  return httpClient<User | null>(`${API_URL}/user/me`, "GET");
};
