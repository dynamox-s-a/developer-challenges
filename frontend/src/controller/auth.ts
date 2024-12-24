import { httpClient } from "@/utils/httpClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Makes an API call to log in a user by sending email and password.
 * @param {string} email - The email of the user attempting to log in.
 * @param {string} password - The password of the user attempting to log in.
 * @returns {Promise<void>} - A promise that resolves when the login request is complete.
 */
export const loginController = async (
  email: string,
  password: string,
): Promise<void> => {
  return httpClient<void>(`${API_URL}/auth/login`, "POST", { email, password });
};

/**
 * Makes an API call to log out the current user.
 * @returns {Promise<void>} - A promise that resolves when the logout request is complete.
 */
export const logoutController = async (): Promise<void> => {
  return httpClient<void>(`${API_URL}/auth/logout`, "POST");
};
