import axios from 'axios';
import axiosRetry from 'axios-retry';

export const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosRetry(api, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError
        (error) || error.response?.status === 503;
    },
    onRetry: (retryCount, error) => {
        console.warn(`Tentativa ${retryCount} após erro:`, error.message);
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.error('Erro de rede:', error.message);
            return Promise.reject({
                message: 'Erro de conexão. Verifique sua internet.',
                type: 'network_error'
            });
        }

        if (error.response.status === 401) {
            try {
                localStorage.clear();
            } catch (e) {
                console.error('Erro ao limpar localStorage:', e);
            }
            window.location.href = '/login';
            return Promise.reject(error);
        }

        if (error.response.status >= 500) {
            console.error('Erro do servidor:', error.response.data);
            return Promise.reject({
                message: 'Erro no servidor. Tente novamente em alguns instantes.',
                type: 'server_error'
            });
        }
        
        return Promise.reject(error);
    }
);

export default api;
