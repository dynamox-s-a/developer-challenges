import { GET } from './route';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

jest.mock('jsonwebtoken');

describe('Verify Route', () => {
  const mockDecoded = { userId: '123', userName: 'Test User' };
  const mockToken = 'valid-token';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  function createMockRequest(cookies?: Record<string, string>): NextRequest {
    return {
      cookies: {
        get: (name: string) => (cookies?.[name] ? { value: cookies[name] } : undefined),
      },
    } as unknown as NextRequest;
  }

  it('should return 200 and user data for valid token', async () => {
    (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

    const request = createMockRequest({ user: mockToken });
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toEqual(mockDecoded);
    expect(json.message).toBe('Usuário autenticado.');
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret');
  });

  it('should return 401 if no token is present', async () => {
    const request = createMockRequest({});
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.success).toBe(false);
    expect(json.message).toBe('Não autenticado.');
  });

  it('should return 500 if JWT_SECRET is missing', async () => {
    delete process.env.JWT_SECRET;
    const request = createMockRequest({ user: mockToken });
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.message).toBe('Erro de configuração do servidor.');
  });

  it('should return 401 for invalid token', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('invalid token');
    });

    const request = createMockRequest({ user: 'invalid-token' });
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.success).toBe(false);
    expect(json.message).toBe('Token inválido ou expirado.');
  });

  it('should return 401 for expired token', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('jwt expired');
    });

    const request = createMockRequest({ user: 'expired-token' });
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.success).toBe(false);
    expect(json.message).toBe('Token inválido ou expirado.');
  });
});