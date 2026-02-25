import { decodeFakeJwtToken } from './token';

describe('decodeFakeJwtToken', () => {
  it('should decode a valid JWT token', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIn0.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIn0=';
    const decodedPayload = decodeFakeJwtToken(token);
    expect(decodedPayload).toEqual({ sub: 'test@example.com', role: 'admin' });
  });
});
