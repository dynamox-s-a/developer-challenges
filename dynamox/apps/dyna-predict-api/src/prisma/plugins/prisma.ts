/**
 * @fileoverview Fastify plugin that initializes the Prisma Client and decorates
 * it onto the Fastify instance. Uses the PrismaPg Driver Adapter required by
 * Prisma 6+ with the ESM-first "prisma-client" provider.
 */

import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { PrismaClient } from '../generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

export default fp(async function (fastify: FastifyInstance) {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  const trackDbMetrics = process.env.TRACK_DB_METRICS === 'true';
  const trackDbQuerySql = process.env.TRACK_DB_QUERY_SQL === 'true';

  const prisma = new PrismaClient({
    adapter,
    log: trackDbMetrics ? [{ emit: 'event', level: 'query' }] : [],
  });

  if (trackDbMetrics) {
    fastify.log.info('DB performance metrics enabled!');
    prisma.$on('query', (event) => {
      if (trackDbQuerySql) {
        fastify.log.info(
          { query: event.query, duration: `${event.duration.toFixed(3)}ms` },
          'Prisma query metrics:',
        );
      } else {
        fastify.log.info({ duration: `${event.duration.toFixed(3)}ms` }, 'Prisma query metrics:');
      }
    });
  }

  await prisma.$connect();

  fastify.decorate('prisma', prisma);

  fastify.addHook('onReady', async () => {
    // NOTE (@eric-reis): `SELECT 1` avoids a cold start on the first request — pg.Pool connects
    //                    lazily, which would cost ~600ms on the first DB hit after server startup.
    await prisma.$queryRaw`SELECT 1`;
    fastify.log.info('Prisma connected successfully');
  });

  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
});
