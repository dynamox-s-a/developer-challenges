import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development'
    ? 'http://localhost:3333'
    : 'https://dynamox-challenge.onrender.com',
});

export interface ApiError {
  message: string;
  statusCode: number;
}

export * from './features/users';
export * from './features/sensors';
export * from './features/machines';
export * from './features/monitoringPoints';
