import { loginSchema } from './auth.schema.ts';

describe('loginSchema', () => {
  it('should accept a valid email and password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('should reject an invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: '123456',
    });
    expect(result.success).toBe(false);
  });

  it('should reject an empty password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});
