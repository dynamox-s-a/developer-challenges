import axios from 'axios';
import { tokenStorage } from './token-storage';

// Formato de erro que a nossa API devolve (ver error-handler.ts na API)
type ApiErrorResponse = {
  error: { code: string; message: string; details?: unknown };
};

// Todas as chamadas começam com /api (o proxy do Vite manda para a porta 3000)
export const api = axios.create({
  baseURL: '/api',
});

// Interceptor: roda antes de TODA requisição e coloca o token no cabeçalho
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Transforma qualquer erro de requisição numa mensagem para mostrar ao usuário
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.error?.message ??
      'Não foi possível conectar ao servidor'
    );
  }
  return 'Erro inesperado';
}