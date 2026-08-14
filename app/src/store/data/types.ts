import type { Data } from '../../types/data';

export interface DataState {
  data: Data[];
  loading: boolean;
  error: string | null;
}

export const DataActionTypes = {
  FETCH_REQUEST: 'data/FETCH_REQUEST',
  FETCH_SUCCESS: 'data/FETCH_SUCCESS',
  FETCH_FAILURE: 'data/FETCH_FAILURE',
} as const;
