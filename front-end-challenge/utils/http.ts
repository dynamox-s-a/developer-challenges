/**
 * Common HTTP headers
 */
export const HTTP_HEADERS = {
  CONTENT_TYPE: "Content-Type",
  AUTHORIZATION: "Authorization",
  ACCEPT: "Accept",
  USER_AGENT: "User-Agent",
} as const;

/**
 * Content type constants
 */
export const CONTENT_TYPES = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data",
  URL_ENCODED: "application/x-www-form-urlencoded",
  TEXT: "text/plain",
} as const;

/**
 * Checks if a response status indicates success
 */
export const isSuccessStatus = (status: number): boolean => {
  return status >= 200 && status < 300;
};

/**
 * Checks if a response status indicates client error
 */
export const isClientError = (status: number): boolean => {
  return status >= 400 && status < 500;
};

/**
 * Checks if a response status indicates server error
 */
export const isServerError = (status: number): boolean => {
  return status >= 500 && status < 600;
};
