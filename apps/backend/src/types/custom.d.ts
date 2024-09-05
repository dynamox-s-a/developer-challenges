// src/types/custom.d.ts
import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: string; // ou o tipo correto que você espera para `user`
  }
}
