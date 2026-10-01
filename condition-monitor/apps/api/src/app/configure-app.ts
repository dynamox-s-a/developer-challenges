import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

/**
 * Application-wide settings, shared by `main.ts` and the HTTP tests so that tests run
 * the same application the server does.
 */
export function configureApp(app: NestExpressApplication): void {
  app.setGlobalPrefix('api');
  // A submission of 2,000 readings (C8) is about 250 KB of JSON; Express accepts 100 KB
  // by default. 2 MB matches the CSV upload limit and leaves room for longer field values.
  app.useBodyParser('json', { limit: '2mb' });
  app.use(cookieParser());
}
