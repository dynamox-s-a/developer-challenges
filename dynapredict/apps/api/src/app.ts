import express from 'express';
import { errorHandler } from './middlewares/error-handler.ts';
import { notFoundHandler } from './middlewares/not-found.ts';
import { authRouter } from './modules/auth/auth.routes.ts';
import { healthRouter } from './modules/health/health.routes.ts';

export const app = express();

// Permite que a API leia JSON enviado no corpo das requisições
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);

// Nenhuma rota acima respondeu: 404 em JSON
app.use(notFoundHandler);

// Precisa ser o último: recebe os erros de todas as rotas acima
app.use(errorHandler);
