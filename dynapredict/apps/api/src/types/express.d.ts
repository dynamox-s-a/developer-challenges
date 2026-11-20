import type { TokenPayload } from '../lib/jwt.ts';

// Ensina o TypeScript que o req do Express pode ter o usuário logado,
// preenchido pelo middleware requireAuth
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export {};