import axios from 'axios';

const API_URL = 'http://localhost:5000/api/machines';

export const getMachines = () => axios.get(API_URL);

export const createMachine = (data: { name: string; type: string }) =>
  axios.post(API_URL, data);

export const updateMachine = (id: string, data: { name: string; type: string }) =>
  axios.put(`${API_URL}/${id}`, data);

export const deleteMachine = (id: string) =>
  axios.delete(`${API_URL}/${id}`);
