import { DataActionTypes } from './types';
import type { Data } from '../../types/data';

export const fetchDataRequest = () => ({
  type: DataActionTypes.FETCH_REQUEST,
});

export const fetchDataSuccess = (data: Data[]) => ({
  type: DataActionTypes.FETCH_SUCCESS,
  payload: data,
});

export const fetchDataFailure = (error: string) => ({
  type: DataActionTypes.FETCH_FAILURE,
  payload: error,
});
