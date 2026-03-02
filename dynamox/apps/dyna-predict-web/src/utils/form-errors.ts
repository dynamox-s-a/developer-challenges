import { isAxiosError } from 'axios';

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) return error.response?.data?.error?.message ?? fallback;
  return fallback;
}
