/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sensor } from '@prisma/client';
import { api, ApiError } from '../index';
import {
  CreateSensorDto, createSensorDto,
  UpdateSensorDto, updateSensorDto,
} from '@dynamox-challenge/dto';
import createAppAsyncThunk from '../createAppAsyncThunk';

interface CreateSensor {
  body: CreateSensorDto;
  accessToken: string;
}

interface GetSensor {
  sensorId: number;
  accessToken: string;
}

interface GetSensors {
  accessToken: string;
}

interface UpdateSensor {
  sensorId: number;
  body: UpdateSensorDto;
  accessToken: string;
}

interface DeleteSensor {
  sensorId: number;
  accessToken: string;
}

export const createSensor = createAppAsyncThunk(
  'sensors/createSensor',
  async({ body, accessToken }: CreateSensor): Promise<Sensor | ApiError> => {
  try {
    const validation = createSensorDto.safeParse(body);
    if (!validation.success) {
      return {
        message: 'Invalid data',
        statusCode: 400,
      };
    }
    const data = validation.data;
    const response = await api.post('/sensors', data, {
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

export const getSensor = createAppAsyncThunk(
  'sensors/getSensor',
  async ({sensorId, accessToken}: GetSensor): Promise<Sensor | ApiError> => {
  try {
    const response = await api.get(`/sensors/${sensorId}`, {
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

export const getSensors = createAppAsyncThunk(
  'sensors/getSensors',
  async ({accessToken}: GetSensors): Promise<Sensor[] | ApiError> => {
  try {
    const response = await api.get('/sensors', {
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

export const updateSensor = createAppAsyncThunk(
  'sensors/updateSensor',
  async ({ sensorId, body, accessToken }: UpdateSensor): Promise<Sensor | ApiError> => {
  try {
    const validation = updateSensorDto.safeParse(body);
    if (!validation.success) {
      return {
        message: 'Invalid data',
        statusCode: 400,
      };
    }
    const data = validation.data;
    const response = await api.patch(`/sensors/${sensorId}`, data, {
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

export const deleteSensor = createAppAsyncThunk(
  'sensors/deleteSensor',
  async({ sensorId, accessToken }: DeleteSensor): Promise<ApiError | number> => {
  try {
    await api.delete(`/sensors/${sensorId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return sensorId;
  } catch (error: any) {
    return {
      message: error.message || 'Internal server error',
      statusCode: error.response?.status || 500,
    };
  }
});
