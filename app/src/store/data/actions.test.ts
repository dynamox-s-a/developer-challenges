import { describe, expect, it } from 'vitest';
import type { Data } from '../../types/data';
import { fetchDataFailure, fetchDataRequest, fetchDataSuccess } from './actions';
import { DataActionTypes } from './types';

describe('data actions', () => {
  it('creates FETCH_REQUEST action', () => {
    expect(fetchDataRequest()).toEqual({
      type: DataActionTypes.FETCH_REQUEST,
    });
  });

  it('creates FETCH_SUCCESS action with payload', () => {
    const data = [{}, {}] as Data[];

    expect(fetchDataSuccess(data)).toEqual({
      type: DataActionTypes.FETCH_SUCCESS,
      payload: data,
    });
  });

  it('creates FETCH_FAILURE action with payload', () => {
    const error = 'Network error';

    expect(fetchDataFailure(error)).toEqual({
      type: DataActionTypes.FETCH_FAILURE,
      payload: error,
    });
  });
});
