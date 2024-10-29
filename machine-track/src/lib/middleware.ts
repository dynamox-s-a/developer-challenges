import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

type Handler = (req: NextRequest, context: { params?: any }) => Promise<NextResponse>;

export function authMiddleware(handler: Handler) {
  return async (req: NextRequest, context: { params?: any }) => {
    try {
      const token = req.headers.get('authorization')?.split(' ')[1];
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const decoded = verifyToken(token);

      if (typeof decoded !== 'string' && 'userId' in decoded) {
        req.headers.set('x-user-id', decoded.userId.toString());
      }

      return handler(req, context);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
}
