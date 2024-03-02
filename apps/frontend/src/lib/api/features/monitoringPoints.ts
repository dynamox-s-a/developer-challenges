/* eslint-disable @typescript-eslint/no-explicit-any */
import { MonitoringPoint } from '@prisma/client';
import { api, ApiError } from '../index';
import {
  CreateMonitoringPointDto, createMonitoringPointDto,
  UpdateMonitoringPointDto, updateMonitoringPointDto,
} from '@dynamox-challenge/dto';
import createAppAsyncThunk from '../createAppAsyncThunk';

interface CreateMonitoringPoint {
  body: CreateMonitoringPointDto;
  accessToken: string;
}

interface GetMonitoringPoint {
  monitoringPointsId: number;
  accessToken: string;
}

interface GetMonitoringPoints {
  accessToken: string;
}

interface UpdateMonitoringPoint {
  monitoringPointsId: number;
  body: UpdateMonitoringPointDto;
  accessToken: string;
}

interface DeleteMonitoringPoint {
  monitoringPointsId: number;
  accessToken: string;
}

export const createMonitoringPoint = createAppAsyncThunk(
  'monitoringPoints/createMonitoringPoint',
  async({ body, accessToken }: CreateMonitoringPoint): Promise<MonitoringPoint | ApiError> => {
  try {
    const validation = createMonitoringPointDto.safeParse(body);
    if (!validation.success) {
      return {
        message: 'Invalid data',
        statusCode: 400,
      };
    }
    const data = validation.data;
    const response = await api.post('/monitoring-points', data, {
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

export const getMonitoringPoint = createAppAsyncThunk(
  'monitoringPoints/getMonitoringPoint',
  async ({monitoringPointsId, accessToken}: GetMonitoringPoint): Promise<MonitoringPoint | ApiError> => {
  try {
    const response = await api.get(`/monitoring-points/${monitoringPointsId}`, {
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

export const getMonitoringPoints = createAppAsyncThunk(
  'monitoringPoints/getMonitoringPoints',
  async ({accessToken}: GetMonitoringPoints): Promise<MonitoringPoint[] | ApiError> => {
  try {
    const response = await api.get('/monitoring-points', {
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

export const updateMonitoringPoint = createAppAsyncThunk(
  'monitoringPoints/updateMonitoringPoint',
  async ({ monitoringPointsId, body, accessToken }: UpdateMonitoringPoint): Promise<MonitoringPoint | ApiError> => {
  try {
    const validation = updateMonitoringPointDto.safeParse(body);
    if (!validation.success) {
      return {
        message: 'Invalid data',
        statusCode: 400,
      };
    }
    const data = validation.data;
    const response = await api.patch(`/monitoring-points/${monitoringPointsId}`, data, {
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

export const deleteMonitoringPoint = createAppAsyncThunk(
  'monitoringPoints/deleteMonitoringPoint',
  async({ monitoringPointsId, accessToken }: DeleteMonitoringPoint): Promise<ApiError | number> => {
  try {
    await api.delete(`/monitoring-points/${monitoringPointsId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return monitoringPointsId;
  } catch (error: any) {
    return {
      message: error.message || 'Internal server error',
      statusCode: error.response?.status || 500,
    };
  }
});
