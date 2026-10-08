import type {
  AuthSessionDto,
  AuthUserDto,
  LoginRequest,
} from '@dynapredict/shared-types';
import { apiClient } from './apiClient';

/** Sets the session cookie and returns the logged-in user. */
export async function login(credentials: LoginRequest): Promise<AuthUserDto> {
  const { data } = await apiClient.post<AuthSessionDto>(
    '/auth/login',
    credentials,
  );
  return data.user;
}

/** Clears the session cookie. */
export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

/** The user behind the current cookie; rejects with 401 when there is none. */
export async function me(): Promise<AuthUserDto> {
  const { data } = await apiClient.get<AuthSessionDto>('/auth/me');
  return data.user;
}
