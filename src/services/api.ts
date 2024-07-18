import axios, { AxiosResponse } from 'axios';
import { Data } from '../interfaces/types';

export const fetchEndpoint = (id: number): Promise<AxiosResponse<Data>> => {
  return axios.get(`http://localhost:3000/${id}`);
};
