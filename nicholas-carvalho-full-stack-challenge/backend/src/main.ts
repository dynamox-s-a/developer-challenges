import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from "cookie-parser";
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Dynamox Challenge API")
    .setDescription("API to monitoration of sensors and industrial machines")
    .setVersion("1.0")
    .addCookieAuth('acess_token')
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.enableCors({ origin: true, credentials: true });
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
