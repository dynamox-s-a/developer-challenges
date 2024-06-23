import { Request } from 'express';
import { User } from '../../user/entities/user.entity';
import { UserFromJwt } from '../model/UserFromJwt'; 

export interface AuthRequest extends Request {
  principal: User;
  user: UserFromJwt; 
}