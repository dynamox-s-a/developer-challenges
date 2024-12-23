import { User } from "@/types/user";
import { httpClient } from "@/utils/httpClient";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getMeController = async (): Promise<User | null> => {
  return httpClient<User | null>(`${API_URL}/user/me`, "GET");
};

export const createUserController = async (
  email: string,
  password: string,
): Promise<void> => {
  return httpClient<void>(`${API_URL}/user/create`, "POST", { email, password });
};
