import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001',
});

export const getAllProducts = async () => {
  const url = '/produtos'
  const data = await API.get(url);
  return data;
};

export const signIn = async (body) => {
  const url = '/'

  const { data } = await API.post(url, body);

  return data;
};

export const createProduct = async (body) => {
  const url = '/produtos'
  const data = await API.post(url, body);
  return data;
};