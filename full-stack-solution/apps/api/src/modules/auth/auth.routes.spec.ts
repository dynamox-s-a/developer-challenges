import { hash } from "bcryptjs";
import { Router, type Express } from "express";
import request from "supertest";
import { createApp } from "../../app";
import { createAuthModule } from "./auth.module";
import type { AuthRepository } from "./auth.repository";
import { TokenService } from "./token.service";

describe("auth routes", () => {
  const user = { id: "u1", email: "admin@example.com" };
  const password = "correct-password";
  let app: Express;

  beforeAll(async () => {
    const passwordHash = await hash(password, 4);
    const repository: AuthRepository = {
      findCredentialsByEmail: async (email) =>
        email === user.email ? { ...user, password: passwordHash } : null,
      findById: async (id) => (id === user.id ? user : null),
    };
    const auth = createAuthModule(
      repository,
      new TokenService("s".repeat(32), "1h"),
    );
    app = createApp({ auth: auth.router, machines: Router() });
  });

  const login = () =>
    request(app).post("/api/auth/login").send({ email: user.email, password });

  describe("POST /api/auth/login", () => {
    it("returns a token and never exposes the password", async () => {
      const response = await login();

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toEqual(expect.any(String));
      expect(response.body.user).toEqual(user);
      expect(JSON.stringify(response.body)).not.toContain("password");
    });

    it("returns 401 for a wrong password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: user.email, password: "wrong" });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe("UNAUTHORIZED");
    });

    it("returns 400 for an invalid body", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "not-an-email" });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("private routes", () => {
    it("GET /me returns 401 without a token", async () => {
      const response = await request(app).get("/api/auth/me");
      expect(response.status).toBe(401);
    });

    it("GET /me returns 401 for a malformed header", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer");
      expect(response.status).toBe(401);
    });

    it("GET /me returns the current user with a valid token", async () => {
      const { body } = await login();

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${body.accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(user);
    });

    it("POST /logout returns 204 with a token and 401 without", async () => {
      const { body } = await login();

      const withToken = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${body.accessToken}`);
      const withoutToken = await request(app).post("/api/auth/logout");

      expect(withToken.status).toBe(204);
      expect(withoutToken.status).toBe(401);
    });
  });
});
