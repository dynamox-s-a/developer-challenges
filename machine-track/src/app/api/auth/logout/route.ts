import { NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/middleware';

export const DELETE = authMiddleware(async () => {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set('token', '', { maxAge: -1 });
  return response;
});
