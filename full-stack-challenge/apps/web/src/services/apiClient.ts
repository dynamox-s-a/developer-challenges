import type { ApiError } from '@dynamox/shared';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export class ApiClientError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errors?: string[]
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

function getToken(): string | null {
  return localStorage.getItem('accessToken');
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = data as ApiError;
    throw new ApiClientError(
      error.statusCode ?? response.status,
      error.message ?? 'Request failed',
      error.errors
    );
  }

  return data as T;
}
