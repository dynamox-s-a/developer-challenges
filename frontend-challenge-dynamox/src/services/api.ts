import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://developer-challenges.onrender.com',
});