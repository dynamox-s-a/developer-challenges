import { User } from "@/types/user";
import { httpClient } from "@/utils/httpClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetches the current authenticated user from the backend.
 * @returns {Promise<User | null>} A promise that resolves to the current user object
 * or null if the user is not authenticated.
 */
export const getMeController = async (): Promise<User | null> => {
  return httpClient<User | null>(`${API_URL}/user/me`, "GET");
};

/**
 * Creates a new user by sending their email and password to the backend.
 * @param {string} email - The email address of the new user.
 * @param {string} password - The password of the new user.
 * @returns {Promise<void>} A promise that resolves when the user is successfully created.
 */
export const createUserController = async (
  email: string,
  password: string,
): Promise<void> => {
  return httpClient<void>(`${API_URL}/user/create`, "POST", { email, password });
};