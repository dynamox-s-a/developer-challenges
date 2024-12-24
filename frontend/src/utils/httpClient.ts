import { Method } from "axios";

export const httpClient = async <T>(
  url: string,
  method: Method,
  data?: object,
  headers: HeadersInit = {
    "Content-Type": "application/json",
  },
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  const contentType = response.headers.get("content-type");
  const responseData = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(
      (responseData && responseData.message) ||
        `HTTP Error: ${response.statusText}`,
    );
  }

  return responseData;
};
