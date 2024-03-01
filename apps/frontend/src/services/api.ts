/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { User } from '@prisma/client';
import {
  CreateUserDto, createUserDto,
} from '@dynamox-challenge/dto';

interface ApiError {
  message: string;
  statusCode: number;
}

export const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development'
    ? 'http://localhost:3333'
    : 'https://dynamox-challenge.onrender.com',
});

export const createUser = async (body: CreateUserDto): Promise<User | ApiError> => {
  try {
    const validation = createUserDto.safeParse(body);
    if (!validation.success) {
      return {
        message: 'Invalid data',
        statusCode: 400,
      };
    }
    const data = validation.data;
    const response = await api.post('/users', data);
    return response.data;
  } catch (error: any) {
    console.log('createUser: ', error);
    return {
      message: error.message || 'Internal server error',
      statusCode: error.response?.status || 500,
    };
  }
};
