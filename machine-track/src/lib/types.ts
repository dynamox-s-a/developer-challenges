import { JwtPayload } from 'jsonwebtoken';
import { NextApiRequest } from 'next';

export interface AuthenticatedRequest extends NextApiRequest {
  userId?: string;
}

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
}
