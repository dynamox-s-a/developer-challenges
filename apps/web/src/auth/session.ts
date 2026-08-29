import { type LoginResponse, loginResponseSchema } from "@dyn/contracts";

const SESSION_KEY = "dynamonitor.session";

export function readSession(): LoginResponse | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const session = loginResponseSchema.safeParse(JSON.parse(raw));
    if (!session.success || Date.parse(session.data.expiresAt) <= Date.now()) {
      clearSession();
      return null;
    }
    return session.data;
  } catch {
    clearSession();
    return null;
  }
}

export function writeSession(session: LoginResponse): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
