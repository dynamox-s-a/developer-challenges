import axios, { AxiosError } from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000, // Set a timeout for requests (in milliseconds)
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
