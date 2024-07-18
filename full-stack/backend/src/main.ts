import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const corsEnabled = configService.get<boolean>('cors.enabled');
  const corsOrigin = configService.get<string>('cors.origin');

  if (corsEnabled) {
    app.enableCors({
      origin: corsOrigin,
    });
  }
  await app.listen(3333);
}
bootstrap();
