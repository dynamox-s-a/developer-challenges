import api from './api';

export async function PostLogin(email, password) {
  const response = await api.post('/users', { email, password });
  return response.data;
}
//
