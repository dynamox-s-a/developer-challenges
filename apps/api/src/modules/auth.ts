import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

import type { AuthenticatedUser, LoginResponse } from "@dyn/contracts";
import type { UserRow } from "@dyn/database";
import { sign, verify } from "hono/jwt";

import { ConflictError, DomainError } from "../shared/errors.js";
import type { UserRepository } from "./users/repository.js";

const jwtIssuer = "dyn-api";
const jwtAudience = "dyn-web";
const keyLength = 64;
const derivePassword = promisify(scrypt) as (
  password: string,
  salt: Uint8Array,
  keyLength: number
) => Promise<Buffer>;

export interface AuthService {
  register: (email: string, password: string) => Promise<LoginResponse>;
  login: (email: string, password: string) => Promise<LoginResponse>;
  verifyToken: (token: string) => Promise<AuthenticatedUser>;
}

export interface AuthServiceOptions {
  repository: UserRepository;
  jwtSecret: string;
  expiresInSeconds: number;
  now?: () => Date;
}

export class AuthenticationError extends DomainError {
  constructor(code: "INVALID_CREDENTIALS" | "INVALID_TOKEN", message: string) {
    super({ code, message, status: 401 });
    this.name = "AuthenticationError";
  }
}

function invalidCredentials(): AuthenticationError {
  return new AuthenticationError("INVALID_CREDENTIALS", "Email or password is incorrect");
}

export function createAuthService(options: AuthServiceOptions): AuthService {
  const now = options.now ?? (() => new Date());
  // Unknown emails still pay for one scrypt derivation against this salt, so response timing does
  // not reveal whether an account exists.
  const timingEqualizerSalt = randomBytes(16);

  async function issueSession(user: UserRow): Promise<LoginResponse> {
    const issuedAt = Math.floor(now().getTime() / 1000);
    const expiresAtSeconds = issuedAt + options.expiresInSeconds;
    const accessToken = await sign(
      {
        sub: user.id,
        email: user.email,
        iss: jwtIssuer,
        aud: jwtAudience,
        iat: issuedAt,
        exp: expiresAtSeconds,
      },
      options.jwtSecret,
      "HS256"
    );

    return {
      accessToken,
      tokenType: "Bearer",
      expiresAt: new Date(expiresAtSeconds * 1000).toISOString(),
      user: { email: user.email },
    };
  }

  return {
    async register(email, password) {
      const normalizedEmail = email.toLowerCase();
      const salt = randomBytes(16);
      const hash = await derivePassword(password, salt, keyLength);
      const user = await options.repository.createUser({
        email: normalizedEmail,
        passwordSalt: salt.toString("base64"),
        passwordHash: hash.toString("base64"),
      });

      if (!user) {
        throw new ConflictError("An account with this email already exists");
      }

      return issueSession(user);
    },

    async login(email, password) {
      const user = await options.repository.findUserByEmail(email.toLowerCase());
      const salt = user ? Buffer.from(user.passwordSalt, "base64") : timingEqualizerSalt;
      const expected = user ? Buffer.from(user.passwordHash, "base64") : null;
      const actual = await derivePassword(password, salt, keyLength);
      const passwordMatches =
        expected !== null && expected.length === actual.length && timingSafeEqual(actual, expected);

      if (!user || !passwordMatches) {
        throw invalidCredentials();
      }

      return issueSession(user);
    },

    async verifyToken(token) {
      // hono/jwt verifies the signature and expiry; the issuer claims are ours to check.
      let payload: Awaited<ReturnType<typeof verify>>;
      try {
        payload = await verify(token, options.jwtSecret, "HS256");
      } catch {
        throw new AuthenticationError("INVALID_TOKEN", "Access token is invalid or expired");
      }

      const email = payload.email;
      if (payload.iss !== jwtIssuer || payload.aud !== jwtAudience || typeof email !== "string") {
        throw new AuthenticationError("INVALID_TOKEN", "Access token is invalid");
      }

      return { email };
    },
  };
}
