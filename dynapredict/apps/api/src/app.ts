import express from 'express';
import { healthRouter } from './modules/health/health.routes.ts';

export const app = express();

// Permite que a API leia JSON enviado no corpo das requisições
app.use(express.json());

app.use('/api/health', healthRouter);