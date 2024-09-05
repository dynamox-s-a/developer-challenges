import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface UserRequest extends Request {
  user?: string | JwtPayload;
}