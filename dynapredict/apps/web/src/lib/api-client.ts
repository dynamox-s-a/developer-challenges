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

// Interceptor de requisição: roda antes de TODA requisição e coloca o token no cabeçalho
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Quem deve ser avisado quando a API responder 401 (quem configura isso é a store)
let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(callback: () => void) {
  onUnauthorized = callback;
}

// Interceptor de resposta: roda depois de TODA resposta.
// Se a API disser 401 (token vencido ou inválido), avisa para deslogar
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      // Senha errada também é 401, mas não é "sessão expirada"
      error.config?.url !== '/auth/login'
    ) {
      onUnauthorized?.();
    }
    // O erro continua seguindo para quem fez a chamada
    return Promise.reject(error);
  },
);

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
