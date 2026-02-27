/**
 * @fileoverview Fastify application factory. Registers all plugins and routes
 * using AutoLoad, which discovers files automatically by folder convention.
 * Load order: shared plugins → prisma plugin → domain plugins → routes.
 */

import path from 'node:path';
import type { FastifyInstance } from 'fastify';
import AutoLoad from '@fastify/autoload';
import fg from 'fast-glob';
import type { FastifyPluginOptions } from 'fastify';

export type AppOptions = FastifyPluginOptions;

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'shared/plugins'),
    options: { ...opts },
  });

  // NOTE (@eric-reis): Prisma must be loaded before domain plugins since auth and other domain
  //                    plugins depend on fastify.prisma being available.
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'prisma/plugins'),
    options: { ...opts },
  });

  const pluginFolders = await fg(['**/plugins'], {
    cwd: __dirname,
    onlyDirectories: true,
    absolute: true,
    ignore: ['**/shared/plugins', '**/prisma/plugins'],
  });

  for (const folder of pluginFolders) {
    fastify.register(AutoLoad, {
      dir: folder,
      options: { ...opts },
    });
  }

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'shared/routes'),
    options: { ...opts },
  });

  const routeFolders = await fg(['**/routes'], {
    cwd: __dirname,
    onlyDirectories: true,
    absolute: true,
    ignore: ['**/shared/routes'],
  });

  for (const folder of routeFolders) {
    fastify.register(AutoLoad, {
      dir: folder,
      options: { ...opts, prefix: '/v1' },
    });
  }
}
