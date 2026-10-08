import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

const JWT_SECRET_PLACEHOLDER = 'change-me-in-production';
const BCRYPT_HASH = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3333),
    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
    // Comma-separated list of origins allowed to call the API with cookies.
    CORS_ORIGIN: z
      .string()
      .default('http://localhost:4200')
      .transform((value) =>
        value
          .split(',')
          .map((origin) => origin.trim())
          .filter(Boolean),
      )
      .pipe(z.array(z.url({ protocol: /^https?$/ })).min(1)),
    AUTH_EMAIL: z.email(),
    AUTH_PASSWORD_HASH: z
      .string()
      .regex(BCRYPT_HASH, 'must be a bcrypt hash ($2a/$2b/$2y)'),
    JWT_SECRET: z.string().min(16),
    // Any duration jsonwebtoken accepts, e.g. "8h", "30m", "7d".
    JWT_EXPIRES_IN: z
      .string()
      .regex(/^\d+[smhd]$/, 'must look like 30m, 8h or 7d')
      .default('8h'),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV !== 'production') return;
    if (
      env.JWT_SECRET.length < 32 ||
      env.JWT_SECRET === JWT_SECRET_PLACEHOLDER
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['JWT_SECRET'],
        message:
          'must be a random value of at least 32 characters in production',
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

/**
 * Validates the environment and returns it typed. The error lists every
 * invalid variable by name but never echoes values, since they are secrets.
 */
export function parseEnv(source: NodeJS.ProcessEnv): Env {
  const result = envSchema.safeParse(source);
  if (result.success) return result.data;

  const problems = result.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid environment variables:\n${problems}`);
}

// Tests provide their own fixed environment (see vitest.setup.ts); everywhere
// else a local .env fills in what the real environment doesn't define.
if (process.env['NODE_ENV'] !== 'test') loadDotenv({ quiet: true });

/** Validated once at import, so a misconfigured API fails at boot. */
export const env = parseEnv(process.env);
