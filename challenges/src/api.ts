import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

export const accelerationRmsX = () => api.get('/0');
export const accelerationRmsY = () => api.get('/1');
export const accelerationRmsZ = () => api.get('/2');
export const velocityRmsX = () => api.get('/3');
export const velocityRmsY = () => api.get('/4');
export const velocityRmsZ = () => api.get('/5');
export const temperature = () => api.get('/6');
