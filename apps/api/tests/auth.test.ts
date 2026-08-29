import { describe, expect, it } from "vitest";

import { createAuthService } from "../src/modules/auth.js";
import { inMemoryUsers } from "./in-memory-users.js";

function createService(options: { now?: () => Date } = {}) {
  return createAuthService({
    repository: inMemoryUsers(),
    jwtSecret: "test-secret-that-is-at-least-32-characters",
    expiresInSeconds: 900,
    ...options,
  });
}

describe("authentication service", () => {
  it("registers an account and signs it straight in", async () => {
    const service = createService();
    const registration = await service.register("New@Dynamox.local", "long-enough");

    expect(registration.tokenType).toBe("Bearer");
    expect(registration.user).toEqual({ email: "new@dynamox.local" });
    const verified = await service.verifyToken(registration.accessToken);
    expect(verified).toEqual({ email: "new@dynamox.local" });
  });

  it("logs a registered account in regardless of email casing", async () => {
    const service = createService();
    await service.register("case@dynamox.local", "long-enough");

    const login = await service.login("CASE@dynamox.local", "long-enough");

    expect(login.user).toEqual({ email: "case@dynamox.local" });
    const verified = await service.verifyToken(login.accessToken);
    expect(verified).toEqual({ email: "case@dynamox.local" });
  });

  it("rejects a second registration for the same email with a conflict", async () => {
    const service = createService();
    await service.register("taken@dynamox.local", "long-enough");

    await expect(service.register("Taken@dynamox.local", "another-password")).rejects.toMatchObject(
      {
        code: "CONFLICT",
        status: 409,
      }
    );
  });

  it("returns the same generic error for a wrong password and an unknown email", async () => {
    const service = createService();
    await service.register("known@dynamox.local", "long-enough");

    const expected = {
      code: "INVALID_CREDENTIALS",
      status: 401,
      message: "Email or password is incorrect",
    };
    await expect(service.login("known@dynamox.local", "wrong-password")).rejects.toMatchObject(
      expected
    );
    await expect(service.login("unknown@dynamox.local", "long-enough")).rejects.toMatchObject(
      expected
    );
  });

  it("rejects a malformed token and an expired token alike", async () => {
    await expect(createService().verifyToken("not-a-jwt")).rejects.toMatchObject({
      code: "INVALID_TOKEN",
      status: 401,
    });

    const expiredIssuer = createService({ now: () => new Date(Date.now() - 3_600_000) });
    await expiredIssuer.register("expired@dynamox.local", "long-enough");
    const expired = await expiredIssuer.login("expired@dynamox.local", "long-enough");
    await expect(createService().verifyToken(expired.accessToken)).rejects.toMatchObject({
      code: "INVALID_TOKEN",
      status: 401,
    });
  });
});
