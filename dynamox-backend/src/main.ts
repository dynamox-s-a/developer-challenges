import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://dynamox-frontend.s3-website-us-east-1.amazonaws.com',
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
