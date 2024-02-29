import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app/app.module';
import { MongoExceptionFilter } from './app/core/filters/mongo-exception.filter';
import { ResponseInterceptor } from './app/core/interceptors/response.interceptor';

async function bootstrap() {
  const allowedOrigins = process.env.ALLOWED_ORIGINS;
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: allowedOrigins?.length > 0 ? allowedOrigins.split(',') : [],
    },
  });
  app.setGlobalPrefix('v1');
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new MongoExceptionFilter());
  app.use(compression());
  app.use(helmet());
  app.use(cookieParser());

  app.getHttpAdapter().get('/health-check', (request, response) => {
    response.status(200).json({ status: 'health' });
  });

  const options = new DocumentBuilder()
    .setTitle('Dynamox test api')
    .setDescription(
      'Restfull API to manage the machine and monitoring points creation'
    )
    .setVersion('1.0')
    .addServer(`${process.env.HOST}/v1`)
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
      },
      'basicAuth'
    )
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
      },
      'basicStudent'
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearerAuth'
    )
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('docs', app, document);
  await app.listen(8080);
}
bootstrap();
