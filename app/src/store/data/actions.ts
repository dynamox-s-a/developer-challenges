import { DataActionTypes } from './types';
import type { Data } from '../../types/data';

export const fetchDataRequest = () =>
  ({
    type: DataActionTypes.FETCH_REQUEST,
  }) as const;

export const fetchDataSuccess = (data: Data[]) =>
  ({
    type: DataActionTypes.FETCH_SUCCESS,
    payload: data,
  }) as const;

export const fetchDataFailure = (error: string) =>
  ({
    type: DataActionTypes.FETCH_FAILURE,
    payload: error,
  }) as const;

export type DataActions =
  | ReturnType<typeof fetchDataRequest>
  | ReturnType<typeof fetchDataSuccess>
  | ReturnType<typeof fetchDataFailure>;
