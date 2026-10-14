import { hash } from "bcryptjs";
import { UnauthorizedError } from "../../shared/errors/app-error";
import { AuthService } from "./auth.service";
import type { AuthRepository } from "./auth.repository";
import { TokenService } from "./token.service";

describe("AuthService", () => {
  const tokenService = new TokenService("s".repeat(32), "1h");
  let repository: jest.Mocked<AuthRepository>;
  let service: AuthService;
  let passwordHash: string;

  // Low cost keeps the test fast. Production uses cost 10.
  beforeAll(async () => {
    passwordHash = await hash("correct-password", 4);
  });

  beforeEach(() => {
    repository = { findCredentialsByEmail: jest.fn(), findById: jest.fn() };
    service = new AuthService(repository, tokenService);
  });

  const credentials = () => ({
    id: "u1",
    email: "a@b.com",
    password: passwordHash,
  });

  describe("login", () => {
    it("returns a token and the public user for valid credentials", async () => {
      repository.findCredentialsByEmail.mockResolvedValue(credentials());

      const result = await service.login({
        email: "a@b.com",
        password: "correct-password",
      });

      expect(tokenService.verify(result.accessToken)).toBe("u1");
      expect(result.user).toEqual({ id: "u1", email: "a@b.com" });
      expect(result.user).not.toHaveProperty("password");
    });

    it("rejects a wrong password", async () => {
      repository.findCredentialsByEmail.mockResolvedValue(credentials());

      await expect(
        service.login({ email: "a@b.com", password: "wrong" }),
      ).rejects.toThrow(UnauthorizedError);
    });

    it("answers an unknown e-mail exactly like a wrong password", async () => {
      repository.findCredentialsByEmail.mockResolvedValueOnce(null);
      const unknown = await service
        .login({ email: "nobody@b.com", password: "whatever" })
        .catch((error) => error);

      repository.findCredentialsByEmail.mockResolvedValueOnce(credentials());
      const wrong = await service
        .login({ email: "a@b.com", password: "wrong" })
        .catch((error) => error);

      expect(unknown).toBeInstanceOf(UnauthorizedError);
      expect(unknown.message).toBe(wrong.message);
    });
  });

  describe("getCurrentUser", () => {
    it("returns the user", async () => {
      repository.findById.mockResolvedValue({ id: "u1", email: "a@b.com" });
      await expect(service.getCurrentUser("u1")).resolves.toEqual({
        id: "u1",
        email: "a@b.com",
      });
    });

    it("rejects when the user no longer exists", async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.getCurrentUser("gone")).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });
});
