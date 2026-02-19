import { POST } from './route';
import { NextRequest, NextResponse } from 'next/server';

describe('Logout Route', () => {
  function createMockRequest(): NextRequest {
    return {} as NextRequest;
  }

  it('should return 200 and clear the user cookie', async () => {
    const request = createMockRequest();
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.message).toBe('Logout realizado com sucesso.');
  });

  it('should return 500 on unexpected error', async () => {
    jest.spyOn(NextResponse, 'json').mockImplementationOnce(() => {
      throw new Error('Unexpected error');
    });

    const request = createMockRequest();
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.message).toBe('Unexpected error');
  });
});