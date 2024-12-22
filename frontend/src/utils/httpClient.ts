import { Method } from "axios";

/**
 * HTTP Client wrapper for making API requests.
 * @template T - Type of the expected response.
 * @param {string} url - The API endpoint URL.
 * @param {Method} method - HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param {object} [data] - Request body for POST/PUT requests.
 * @param {object} [headers] - Optional headers for the request.
 * @returns {Promise<T>} - The response data.
 */
export const httpClient = async <T>(
  url: string,
  method: Method,
  data?: object,
  headers: HeadersInit = { "Content-Type": "application/json" },
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.statusText}`);
  }

  return response.json();
};
