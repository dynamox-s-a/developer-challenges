import { z } from "zod";

const envSchema = z.object({
  // Defaults to every interface, matching the pre-existing bind behaviour and the container setup.
  HOST: z.string().min(1).default("0.0.0.0"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  DATABASE_URL: z.string().min(1),
  // Seed identity for the challenge's fixed admin account, inserted into the users table at boot.
  AUTH_EMAIL: z.string().email().default("admin@dynamox.local"),
  AUTH_PASSWORD_SALT: z.string().regex(/^[A-Za-z0-9+/]+=*$/),
  AUTH_PASSWORD_HASH: z.string().regex(/^[A-Za-z0-9+/]+=*$/),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN_SECONDS: z.coerce.number().int().min(60).max(86_400).default(900),
});

export type AppEnv = z.infer<typeof envSchema>;

export function parseEnv(input: NodeJS.ProcessEnv = process.env): AppEnv {
  const parsed = envSchema.safeParse(input);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${issues}`);
  }

  return parsed.data;
}
