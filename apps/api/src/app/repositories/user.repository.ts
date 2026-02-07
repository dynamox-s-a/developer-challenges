import { FastifyInstance } from 'fastify';

export function createUserRepository(fastify: FastifyInstance) {
  return {
    findByEmail: (email: string) => 
      fastify.prisma.user.findUnique({ where: { email } }),
    
    findById: (id: string) => 
      fastify.prisma.user.findUnique({ where: { id } }),
  };
}

export type UserRepository = ReturnType<typeof createUserRepository>;
