import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativa o CORS (para o Frontend poder chamar o Backend depois)
  app.enableCors();

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Dynamox Test API')
    .setDescription('API para gestão de máquinas e sensores')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(
    `📑 Swagger Documentation is running on: http://localhost:${port}/${globalPrefix}/docs`
  );
}

bootstrap();