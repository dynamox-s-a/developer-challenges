import { envSchema, loadEnv } from "./env";

const validEnv = {
  DATABASE_URL: "postgresql://user:pass@localhost:5432/db?schema=public",
  PORT: "4000",
  JWT_SECRET: "a".repeat(32),
  JWT_EXPIRES_IN: "2h",
  SEED_USER_EMAIL: "user@example.com",
  SEED_USER_PASSWORD: "password-123",
};

describe("env", () => {
  const originalEnv = process.env;

  // Every test starts from a known environment, so the local .env file
  // (loaded by dotenv at import time) never influences the result.
  beforeEach(() => {
    process.env = { ...validEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("parses a valid environment and coerces PORT to a number", () => {
    expect(loadEnv()).toEqual({
      DATABASE_URL: validEnv.DATABASE_URL,
      PORT: 4000,
      JWT_SECRET: validEnv.JWT_SECRET,
      JWT_EXPIRES_IN: "2h",
      CORS_ALLOWED_ORIGINS: [],
    });
  });

  describe("CORS_ALLOWED_ORIGINS", () => {
    it("is empty when unset, which mounts no CORS middleware", () => {
      delete process.env.CORS_ALLOWED_ORIGINS;

      expect(loadEnv().CORS_ALLOWED_ORIGINS).toEqual([]);
    });

    it("splits a comma-separated list and trims each origin", () => {
      process.env.CORS_ALLOWED_ORIGINS =
        " https://app.example , https://preview.example ";

      expect(loadEnv().CORS_ALLOWED_ORIGINS).toEqual([
        "https://app.example",
        "https://preview.example",
      ]);
    });

    it("ignores empty entries from a trailing or doubled comma", () => {
      process.env.CORS_ALLOWED_ORIGINS = "https://app.example,,";

      expect(loadEnv().CORS_ALLOWED_ORIGINS).toEqual(["https://app.example"]);
    });
  });

  it("uses defaults for PORT and JWT_EXPIRES_IN", () => {
    delete process.env.PORT;
    delete process.env.JWT_EXPIRES_IN;

    const env = loadEnv();

    expect(env.PORT).toBe(3000);
    expect(env.JWT_EXPIRES_IN).toBe("1h");
  });

  it("does not require the seed variables to start the API", () => {
    delete process.env.SEED_USER_EMAIL;
    delete process.env.SEED_USER_PASSWORD;

    expect(() => loadEnv()).not.toThrow();
  });

  it("rejects a JWT_SECRET shorter than 32 characters", () => {
    process.env.JWT_SECRET = "too-short";

    expect(() => loadEnv()).toThrow(/JWT_SECRET/);
  });

  it("rejects a missing DATABASE_URL", () => {
    delete process.env.DATABASE_URL;

    expect(() => loadEnv()).toThrow(/DATABASE_URL/);
  });

  it("still requires the seed variables in the full schema used by the seed", () => {
    delete process.env.SEED_USER_EMAIL;

    expect(envSchema.safeParse(process.env).success).toBe(false);
  });
});
