import { describe, expect, it } from 'vitest';
import { DataActionTypes } from './types';
import { dataReducer, initialState } from './reducer';

describe('dataReducer', () => {
  it('returns initial state for unknown action', () => {
    const result = dataReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  it('handles FETCH_REQUEST', () => {
    const prevState = {
      data: [{ id: 1 }],
      loading: false,
      error: 'old error',
    };

    const result = dataReducer(prevState as typeof initialState, {
      type: DataActionTypes.FETCH_REQUEST,
    });

    expect(result).toEqual({
      ...prevState,
      loading: true,
      error: null,
    });
  });

  it('handles FETCH_SUCCESS', () => {
    const payload = [{ id: 1 }, { id: 2 }];

    const prevState = {
      ...initialState,
      loading: true,
      error: 'old error',
    };

    const result = dataReducer(prevState, {
      type: DataActionTypes.FETCH_SUCCESS,
      payload,
    });

    expect(result).toEqual({
      ...prevState,
      loading: false,
      data: payload,
    });
  });

  it('handles FETCH_FAILURE', () => {
    const error = 'Network error';

    const prevState = {
      ...initialState,
      loading: true,
    };

    const result = dataReducer(prevState, {
      type: DataActionTypes.FETCH_FAILURE,
      payload: error,
    });

    expect(result).toEqual({
      ...prevState,
      loading: false,
      error,
    });
  });
});
