import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '@/lib/client';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { CustomJwtPayload } from './types';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY as string;

export function verifyToken(token: string): CustomJwtPayload {
  return jwt.verify(token, SECRET_KEY) as CustomJwtPayload;
}

export async function registerUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({ data: { email, password: hashedPassword } });
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Usuário não encontrado');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Senha incorreta');

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
  return { token, user };
}
