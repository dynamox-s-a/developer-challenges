/* eslint-disable @typescript-eslint/no-explicit-any */
import { Machine } from '@prisma/client';
import { api, ApiError } from '../index';
import {
  CreateMachineDto, createMachineDto,
  UpdateMachineDto, updateMachineDto,
} from '@dynamox-challenge/dto';
import createAppAsyncThunk from '../createAppAsyncThunk';

interface CreateMachine {
  body: CreateMachineDto;
  accessToken: string;
}

interface GetMachine {
  machineId: number;
  accessToken: string;
}

interface GetMachines {
  accessToken: string;
}

interface UpdateMachine {
  machineId: number;
  body: UpdateMachineDto;
  accessToken: string;
}

interface DeleteMachine {
  machineId: number;
  accessToken: string;
}

export const createMachine = createAppAsyncThunk(
  'machines/createMachine',
  async({ body, accessToken }: CreateMachine): Promise<Machine | ApiError> => {
  try {
    const validation = createMachineDto.safeParse(body);
    if (!validation.success) {
      return {
        message: 'Invalid data',
        statusCode: 400,
      };
    }
    const data = validation.data;
    const response = await api.post('/machines', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return {
      message: error.message || 'Internal server error',
      statusCode: error.response?.status || 500,
    };
  }
});

export const getMachine = createAppAsyncThunk(
  'machines/getMachine',
  async ({machineId, accessToken}: GetMachine): Promise<Machine | ApiError> => {
  try {
    const response = await api.get(`/machines/${machineId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return {
      message: error.message || 'Internal server error',
      statusCode: error.response?.status || 500,
    };
  }
});

export const getMachines = createAppAsyncThunk(
  'machines/getMachines',
  async ({accessToken}: GetMachines): Promise<Machine[] | ApiError> => {
  try {
    const response = await api.get('/machines', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return {
      message: error.message || 'Internal server error',
      statusCode: error.response?.status || 500,
    };
  }
});

export const updateMachine = createAppAsyncThunk(
  'machines/updateMachine',
  async ({ machineId, body, accessToken }: UpdateMachine): Promise<Machine | ApiError> => {
  try {
    const validation = updateMachineDto.safeParse(body);
    if (!validation.success) {
      return {
        message: 'Invalid data',
        statusCode: 400,
      };
    }
    const data = validation.data;
    const response = await api.patch(`/machines/${machineId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return {
      message: error.message || 'Internal server error',
      statusCode: error.response?.status || 500,
    };
  }
});

export const deleteMachine = createAppAsyncThunk(
  'machines/deleteMachine',
  async({ machineId, accessToken }: DeleteMachine): Promise<ApiError | number> => {
  try {
    await api.delete(`/machines/${machineId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return machineId;
  } catch (error: any) {
    return {
      message: error.message || 'Internal server error',
      statusCode: error.response?.status || 500,
    };
  }
});
