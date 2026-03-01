import { redirect } from 'react-router-dom';
import { store } from '../store/store';
import { fetchMe } from '../store/features/auth/auth.slice';
import { routePaths } from './paths';

/**
 * Redirects to dashboard if authenticated, or to login if not.
 * Used on the root path to avoid rendering a blank page.
 */
export async function rootLoader() {
  const isAuthenticated = await resolveAuth();
  throw redirect(isAuthenticated ? routePaths.dashboard : routePaths.login);
}

/**
 * Prevents authenticated users from accessing guest-only routes (e.g. login).
 * Redirects to dashboard if a session is already active.
 */
export async function guestLoader() {
  const isAuthenticated = await resolveAuth();
  if (isAuthenticated) throw redirect(routePaths.dashboard);

  return null;
}

/**
 * Protects private routes by requiring an active session.
 * Redirects to login if the user is not authenticated.
 */
export async function authLoader() {
  const isAuthenticated = await resolveAuth();
  if (!isAuthenticated) throw redirect(routePaths.login);

  return null;
}

/**
 * Handles unmatched routes (404).
 * Redirects authenticated users to the main dashboard, unauthenticated users to login.
 */
export async function notFoundLoader() {
  const isAuthenticated = await resolveAuth();
  throw redirect(isAuthenticated ? routePaths.dashboard : routePaths.login);
}

/**
 * Resolves the current authentication state.
 * First checks Redux store to avoid unnecessary API calls.
 * Falls back to fetching the current user from the API.
 */
export async function resolveAuth(): Promise<boolean> {
  if (store.getState().auth.isAuthenticated) return true;

  const result = await store.dispatch(fetchMe());
  return fetchMe.fulfilled.match(result);
}
