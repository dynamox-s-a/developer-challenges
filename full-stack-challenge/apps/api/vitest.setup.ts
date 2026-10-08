// Fixed environment for API tests. It never reads .env, so tests behave the
// same locally and in CI. Only the database URL can be overridden, via
// TEST_DATABASE_URL, to point at a different postgres-test instance.
Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL:
    process.env['TEST_DATABASE_URL'] ??
    'postgresql://dynapredict:dynapredict@localhost:5433/dynapredict_test',
  CORS_ORIGIN: 'http://localhost:4200',
  AUTH_EMAIL: 'admin@dynapredict.com',
  // bcrypt hash of "dynapredict123" (cost 10).
  AUTH_PASSWORD_HASH:
    '$2b$10$OdyYOmQp41oMSn1ArDiq8erLkv115W6DHECqimOH6S51brwLSBaCi',
  JWT_SECRET: 'test-secret-with-at-least-32-characters',
  JWT_EXPIRES_IN: '1h',
});
