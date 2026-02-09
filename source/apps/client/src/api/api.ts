import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Add a request interceptor to include the JWT token and track start time
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    const token = (session as any)?.user?.accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach start time to the config
    (config as any).metadata = { startTime: Date.now() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to measure and log latency
api.interceptors.response.use(
  (response) => {
    const metadata = (response.config as any).metadata;
    if (metadata) {
      const duration = Date.now() - metadata.startTime;
      const url = response.config.url || '';
      
      if (process.env.NODE_ENV === 'development') {
        const style = duration > 300 ? 'color: #ff9800; font-weight: bold;' : 'color: #4caf50;';
        console.log(`%c[Latency] ${response.config.method?.toUpperCase()} ${url} - ${duration}ms`, style);
      }
    }
    return response;
  },
  (error) => {
    const metadata = (error.config as any)?.metadata;
    if (metadata) {
      const duration = Date.now() - metadata.startTime;
      if (process.env.NODE_ENV === 'development') {
        console.log(`%c[Latency] ERROR ${error.config.url} - ${duration}ms`, 'color: #f44336; font-weight: bold;');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
