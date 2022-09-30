import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001',
});

export const getAllProducts = async () => {
  const url = '/produtos'
  const data = await API.get(url);
  return data;
};

export const signIn = async (url, body) => {
  const { data } = await API.post(url, body);

  return data;
};