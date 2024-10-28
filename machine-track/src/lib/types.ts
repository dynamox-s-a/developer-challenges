import { JwtPayload } from 'jsonwebtoken';
import { NextApiRequest } from 'next';

// Estender o request com a propriedade userId
export interface AuthenticatedRequest extends NextApiRequest {
  userId?: string;
}

// Estender o JwtPayload para incluir userId
export interface CustomJwtPayload extends JwtPayload {
  userId: string;
}
