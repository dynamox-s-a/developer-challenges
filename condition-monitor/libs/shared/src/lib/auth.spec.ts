import { loginRequestSchema, PASSWORD_MAX_BYTES } from './auth.js';

function errorsOf(input: unknown) {
  const result = loginRequestSchema.safeParse(input);
  return result.success
    ? []
    : result.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }));
}

describe('loginRequestSchema', () => {
  it('normalizes the email to lowercase without spaces', () => {
    expect(
      loginRequestSchema.parse({ email: '  Operator@Plant.TEST ', password: 'secret' }),
    ).toEqual({ email: 'operator@plant.test', password: 'secret' });
  });

  it('names the field of each error', () => {
    expect(errorsOf({ email: 'not an email', password: '' })).toEqual([
      { field: 'email', message: 'Must be a valid email address.' },
      { field: 'password', message: 'Required.' },
    ]);
  });

  it('accepts a password of exactly 72 bytes and rejects 73', () => {
    const email = 'operator@plant.test';
    expect(errorsOf({ email, password: 'a'.repeat(PASSWORD_MAX_BYTES) })).toEqual([]);
    expect(errorsOf({ email, password: 'a'.repeat(PASSWORD_MAX_BYTES + 1) })).toEqual([
      { field: 'password', message: 'Must be at most 72 bytes.' },
    ]);
  });

  it('counts bytes, not characters: 36 accented letters fit, 37 do not', () => {
    const email = 'operator@plant.test';
    expect(errorsOf({ email, password: 'é'.repeat(36) })).toEqual([]);
    expect(errorsOf({ email, password: 'é'.repeat(37) })).toHaveLength(1);
  });

  it('rejects missing fields', () => {
    expect(errorsOf({}).map((error) => error.field)).toEqual(['email', 'password']);
  });
});
