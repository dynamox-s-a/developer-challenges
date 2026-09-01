import 'reflect-metadata';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setupOpenApi } from './openapi';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({ origin: true });
  app.enableShutdownHooks();
  setupOpenApi(app);

  const port = Number(process.env.API_PORT ?? 3000);
  await app.listen(port);

  Logger.log(`API disponível em http://localhost:${port}/api`, 'Bootstrap');
  Logger.log(`Swagger disponível em http://localhost:${port}/api/docs`, 'Bootstrap');
}

void bootstrap();
