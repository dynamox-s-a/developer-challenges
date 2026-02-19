import { POST } from './route';
import dbConnect from '@/lib/database/mongoose';
import userRepository from '@/lib/database/user/repository';
import { NextRequest } from 'next/server';

jest.mock('@/lib/database/mongoose');
jest.mock('@/lib/database/user/repository');

describe('Register Route', () => {
  const validUserData = {
    name: 'New User',
    email: 'new@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createMockRequest(body?: any): NextRequest {
    return {
      json: jest.fn().mockResolvedValue(body),
    } as unknown as NextRequest;
  }

  it('should return 200 on successful registration', async () => {
    (dbConnect as jest.Mock).mockResolvedValue(undefined);
    (userRepository.create as jest.Mock).mockResolvedValue({ id: '456', ...validUserData });

    const request = createMockRequest(validUserData);
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.message).toBe('Usuário cadastrado com sucesso.');
    expect(userRepository.create).toHaveBeenCalledWith(validUserData);
  });

  it('should return 400 if email already exists', async () => {
    (dbConnect as jest.Mock).mockResolvedValue(undefined);
    (userRepository.create as jest.Mock).mockResolvedValue(null);

    const request = createMockRequest(validUserData);
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.message).toBe('Email já cadastrado.');
  });

  it('should return 400 on validation error', async () => {
    const request = createMockRequest({ name: 'Incomplete' });
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.message).toContain('email');
  });

  it('should return 400 on database error during creation', async () => {
    (dbConnect as jest.Mock).mockResolvedValue(undefined);
    (userRepository.create as jest.Mock).mockRejectedValue(new Error('Duplicate key'));

    const request = createMockRequest(validUserData);
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.message).toBe('Duplicate key');
  });
});