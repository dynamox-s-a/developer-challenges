import { z } from "zod";

const isBrowser = typeof window !== "undefined";

const jwtDecoded = z.object({
  exp: z.number(),
  iat: z.number(),
  groupId: z.number(),
  tenant: z.string(),
});

const sessionObject = z.object({
  token: z.string().refine((token) => !!parseJwt(token)),
  email: z.string().email(),
  username: z.string(),
});

export type Session = z.infer<typeof sessionObject>;

const parseJwt = function (jwt: string | null) {
  if (!jwt) return null;
  try {
    const decoded = JSON.parse(atob(jwt.split(".")[1]));
    return jwtDecoded.parse(decoded);
  } catch (err) {
    return null;
  }
};

const expiredSession = function (session: Session): boolean {
  const exp = parseJwt(session.token)?.exp || 0;
  return 1000 * exp <= Date.now();
};

export function getBrowserSession(): Session | null {
  if (!isBrowser) return null;
  const storedSession = localStorage.getItem("session");
  if (!storedSession) return null;
  try {
    return sessionObject.parse(JSON.parse(storedSession));
  } catch (err) {
    localStorage.removeItem("session");
    return null;
  }
}

export function hasSession() {
  const session = getBrowserSession();
  return session ? !expiredSession(session) : false;
}

export function signIn(session: Session): boolean {
  if (!isBrowser) return false;
  try {
    session = sessionObject.parse(session);
    localStorage.setItem("session", JSON.stringify(session));
    return true;
  } catch (err) {
    return false;
  }
}

export function signOut() {
  if (!isBrowser) return;
  localStorage.removeItem("session");
}
