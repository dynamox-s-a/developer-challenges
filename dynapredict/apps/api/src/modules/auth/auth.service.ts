import bcrypt from 'bcryptjs';
import type { LoginInput } from '@dynapredict/shared';
import { AppError } from '../../errors/app-error.ts';
import { signToken } from '../../lib/jwt.ts';
import { prisma } from '../../lib/prisma.ts';

// Hash de uma senha qualquer, usado quando o e-mail não existe. Assim o bcrypt
// roda nos dois casos e a resposta demora o mesmo tempo (senão a demora
// entregaria quais e-mails estão cadastrados)
const DUMMY_HASH = bcrypt.hashSync('senha-que-ninguem-usa', 10);

export async function login({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } });

  const passwordMatches = await bcrypt.compare(
    password,
    user?.passwordHash ?? DUMMY_HASH,
  );

  // Mesma resposta para "e-mail não existe" e "senha errada":
  // assim ninguém consegue descobrir quais e-mails estão cadastrados
  if (!user || !passwordMatches) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'E-mail ou senha inválidos');
  }

  const token = signToken({ sub: user.id, email: user.email });

  return {
    token,
    user: { id: user.id, email: user.email },
  };
}


export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true }, // nunca devolve o passwordHash
  });

  // O token pode ser válido, mas o usuário ter sido apagado depois
  if (!user) {
    throw new AppError(401, 'UNAUTHORIZED', 'Usuário não encontrado');
  }

  return user;
}