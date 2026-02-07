import fp from 'fastify-plugin';
import cors from '@fastify/cors';

export default fp(async function (fastify) {
  fastify.register(cors, {
    origin: true, // Allow all origins for development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
});
