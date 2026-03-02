/**
 * @fileoverview Application entry point. Initializes the Fastify server with TypeBox type provider
 * for automatic type inference from schemas.
 */

// NOTE (@eric-reis): dotenv must be imported first to ensure environment variables are available
//                    when all subsequent modules are loaded.
import 'dotenv/config';

import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { app } from './app';

// NOTE (@eric-reis): TypeBox type provider applied globally so all routes automatically get
//                    TypeScript types inferred from their TypeBox schemas, eliminating the need to
//                    manually specify generics on each route handler.
const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:HH:MM:ss - dd/mm/yyyy',
        ignore: 'pid,hostname',
        levelFirst: true,
        singleLine: false,
        messageFormat: '{msg}',
        errorLikeObjectKeys: 'err,error',
      },
    },
  },
}).withTypeProvider<TypeBoxTypeProvider>();

if (!process.env.JWT_SECRET) {
  server.log.error('JWT_SECRET environment variable is required. Shutting down.');
  process.exit(1);
}

server.register(app);

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

server
  .listen({ port: PORT, host: HOST })
  .then(() => {
    server.log.info(`Server running at http://${HOST}:${PORT}`);
  })
  .catch((err) => {
    server.log.error(err);
    process.exit(1);
  });
