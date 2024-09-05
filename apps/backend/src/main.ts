import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import machineRoutes from './routes/machineRoutes';
import monitoringRoutes from './routes/monitoringRoutes';
import sensorRoutes from './routes/sensorRoutes';
import authRoutes from './routes/authRoutes';
import { protect } from './middleware/authMiddleware';

async function bootstrap() {
  // Conecta ao banco de dados MongoDB
  connectDB();

  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();

  // Habilita CORS para permitir que o front-end se comunique com o back-end
  app.enableCors({
    origin: 'http://localhost:4200', // Especifique explicitamente a origem permitida
    credentials: false, // Permite envio de cookies/credenciais
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  

  // Define um prefixo global para as rotas da API
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Aplica a validação global usando o ValidationPipe
  app.useGlobalPipes(new ValidationPipe());
  
  // Middleware do Express para JSON e CORS
  expressApp.use(cors()); // Usando cors de maneira correta
  expressApp.use(express.json());

  // Rotas de autenticação
  expressApp.use('/api/auth', authRoutes);

  // Rotas de máquinas, monitoramentos e sensores
  expressApp.use('/api/machines', machineRoutes);
  expressApp.use('/api/machines/:id/monitorings', protect, monitoringRoutes);
  expressApp.use('/api/machines/:id/monitorings/:monitoringId/sensors', protect, sensorRoutes);

  // Define a porta 5000 para rodar o servidor
  const port = process.env.PORT || 5000;
  await app.listen(port);
  
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
