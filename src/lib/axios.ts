import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "../@types/types";

export const api = axios.create({
  baseURL: 'http://localhost:3333',
})

export const fetchMeasuresData = async (): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const response = await axios.get<ApiResponse>('/data');
    return response;

  } catch (error) {
    throw new Error('Failed to fetch data');
  }
};