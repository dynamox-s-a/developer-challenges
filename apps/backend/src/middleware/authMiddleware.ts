import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { UserRequest } from '../types/express';

interface JwtPayload {
  id: string;
}

const protect = (req: UserRequest, res: Response, next: NextFunction) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtém o token do header
      token = req.headers.authorization.split(' ')[1];

      // Decodifica o token para obter o payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      // Adiciona o ID do usuário ao objeto de request
      req.user = decoded.id;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  }
};

export { protect };
