export interface AuthConfig {
  jwtSecret: string;
  /** Session lifetime, one hour (assumption A3). */
  sessionTtlSeconds: number;
  /** Cookies travel only over HTTPS in production; local development runs on HTTP. */
  secureCookie: boolean;
}

export const AUTH_CONFIG = Symbol('AUTH_CONFIG');

const MIN_SECRET_LENGTH = 32;

/**
 * Reads the authentication settings once, at startup. A missing or short secret stops
 * the API from starting, rather than letting it sign sessions anyone could forge.
 */
export function readAuthConfig(env: NodeJS.ProcessEnv = process.env): AuthConfig {
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET must have at least ${MIN_SECRET_LENGTH} characters. Copy .env.example to .env or set it.`,
    );
  }
  return {
    jwtSecret,
    sessionTtlSeconds: 60 * 60,
    secureCookie: env.NODE_ENV === 'production',
  };
}
