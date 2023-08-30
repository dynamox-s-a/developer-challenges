import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SensorModel } from 'utils/constants';
import { Machine } from './machines-slice';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface MonitoringPont {
  id: number | string;
  name: string;
  sensorModel: SensorModel;
  machineId: number;
  machine?: Machine;
}

export interface Pagination {
  first?: string | number;
  next?: string | number;
  last?: string | number;
}

const INITIAL_STATE: {
  monitoringPoints: MonitoringPont[];
  pagination: Pagination;
} = {
  monitoringPoints: [],
  pagination: {
    first: undefined,
    next: undefined,
    last: undefined,
  },
};

const PAGINATION_LIMIT = 5;

const formatPage = (url: string) => {
  if (!url) {
    return 0;
  }

  return Number(url.split('page=')[1].split('&')[0]);
};
export const getMonitoringPoints = createAsyncThunk(
  'getMonitoringPoints',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const accessToken = state?.user?.accessToken;

      const { page, order, orderBy } = payload;
      const response = await fetch(
        `${API_URL}/monitoring-points?_expand=machine&_page=${page}&_limit=${PAGINATION_LIMIT}&_sort=${orderBy}&_order=${order}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
            Authentication: `Bearer ${accessToken}`,
          },
        }
      );

      const linkInfo: Pagination = {};
      response.headers
        .get('Link')
        ?.split(', ')
        .forEach((link) => {
          const [url, rel] = link.split('; ');
          const urlMatch = /<(.+)>/.exec(url);
          const relMatch = /rel="(.+)"/.exec(rel);

          if (urlMatch && relMatch) {
            const [, url] = urlMatch;
            const [, relValue] = relMatch;
            linkInfo[relValue as keyof Pagination] = url;
          }

          return linkInfo;
        });

      const data = await response.json();

      if (response.status >= 400) {
        throw rejectWithValue(data);
      }

      return {
        data,
        pagination: {
          first: formatPage(linkInfo.first),
          next: formatPage(linkInfo.next),
          last: formatPage(linkInfo.last),
        },
      };
    } catch (err) {
      const error = err as { response?: any };

      if (!('response' in error)) {
        throw err;
      }

      rejectWithValue(error?.response.data);
    }
  }
);

export const createMonitoringPoint = createAsyncThunk(
  'createMonitoringPoint',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const accessToken = state?.user?.accessToken;

      const { machineId, ...restPayload } = payload;

      const response = await fetch(
        `${API_URL}/machines/${Number(machineId)}/monitoring-points`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
            Authentication: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(restPayload),
        }
      );

      const data = await response.json();
      if (response.status >= 400) {
        throw rejectWithValue(data);
      }

      return data;
    } catch (err) {
      const error = err as { response?: any };

      if (!('response' in error)) {
        throw err;
      }

      rejectWithValue(error?.response.data);
    }
  }
);

export const monitoringPointSlice = createSlice({
  name: 'monitoringPoint',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMonitoringPoints.fulfilled, (state, { payload }) => {
      const monitoringPoints = payload.data;

      state.pagination = payload?.pagination;
      state.monitoringPoints = monitoringPoints;
    });
    builder.addCase(createMonitoringPoint.fulfilled, (state, { payload }) => {
      state.monitoringPoints.push(payload);
    });
  },
});

export default monitoringPointSlice.reducer;
