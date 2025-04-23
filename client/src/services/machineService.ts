import axios from 'axios';

const API_URL = 'https://developer-challenges-507u.onrender.com/api/machines';

export const getMachines = () => axios.get(API_URL);

export const createMachine = (data: { name: string; type: string }) =>
  axios.post(API_URL, data);

export const updateMachine = (id: string, data: { name: string; type: string }) =>
  axios.put(`${API_URL}/${id}`, data);

export const deleteMachine = (id: string) =>
  axios.delete(`${API_URL}/${id}`);
