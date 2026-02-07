import { FastifyInstance } from 'fastify';

interface LoginBody {
  email: string;
  password: string;
}

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: LoginBody }>(
    '/login',
    {
      schema: {
        description: 'Login do usuário',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 1 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async function (request) {
      const { email, password } = request.body;

      const user = await fastify.authService.validateCredentials(email, password);

      if (!user) {
        throw fastify.httpErrors.unauthorized('Invalid email or password');
      }

      const token = fastify.jwt.sign({ userId: user.id });
      
      return { 
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    }
  );
}
