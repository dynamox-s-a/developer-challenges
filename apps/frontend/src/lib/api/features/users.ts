/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@prisma/client';
import { api, ApiError } from '../index';
import {
  CreateSessionDto,
  CreateUserDto, createUserDto,
  UpdateUserDto, updateUserDto,
} from '@dynamox-challenge/dto';

export const createUser = async (
  body: CreateUserDto
): Promise<User | ApiError> => {
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

export const createSession = async(body: CreateSessionDto): Promise<{user: User, accessToken: string} | ApiError> => {
  try {
    const response = await api.post('/sessions', body);
    const { user, accessToken }: { user: User, accessToken: string } = response.data;
    return { user, accessToken };
  } catch (error: any) {
    console.log('createSession: ', error);
    return {
      message: error.message || 'Internal server error',
      statusCode: error.response?.status || 500,
    };
  }
};

export const updateUser = async(
  userId: number, body: UpdateUserDto
): Promise<User | ApiError> => {
  try {
    const validation = updateUserDto.safeParse(body);
    if (!validation.success) {
      return {
        message: 'Invalid data',
        statusCode: 400,
      };
    }
    const data = validation.data;
    const response = await api.patch(`/users/${userId}`, data);
    const user: User = response.data;
    return user;
  } catch (error: any) {
    return {
      message: error.message || 'Internal server error',
      statusCode: error.response?.status || 500,
    };
  }
};
