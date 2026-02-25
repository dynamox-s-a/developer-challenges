import { loginUser } from '../authService';

describe('authService', () => {
  global.fetch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle loginUser with success', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue([{ email: 'teste@teste.com', role: 'teste' }]),
    } as unknown as Response);

    const result = await loginUser('teste@teste.com', 'teste');
    expect(result).toEqual({
      user: { email: 'teste@teste.com', role: 'teste' },
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0ZUB0ZXN0ZS5jb20iLCJyb2xlIjoidGVzdGUifQ==.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiJ0ZXN0ZUB0ZXN0ZS5jb20iLCJyb2xlIjoidGVzdGUifQ==',
    });
  });

  it('should handle loginUser with failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    } as unknown as Response);

    await expect(loginUser('teste@teste.com', 'teste')).rejects.toThrow('Credenciais inválidas');
  });
});
