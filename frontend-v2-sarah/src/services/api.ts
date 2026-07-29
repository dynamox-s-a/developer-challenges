import axios, { AxiosError } from 'axios';

const isProduction = import.meta.env.PROD;

export const api = axios.create({
  baseURL: isProduction ? './' : 'http://localhost:3001',
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Exemplo: deslogar o usuário ou redirecionar
      // authService.logout();
    }
    return Promise.reject(error);
  },
);
