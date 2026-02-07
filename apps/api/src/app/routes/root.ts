import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      schema: {
        description: 'Health check da API',
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async function () {
      return { message: 'Hello API' };
    }
  );
}
