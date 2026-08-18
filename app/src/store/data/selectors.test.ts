import { describe, expect, it } from 'vitest';

import { selectData, selectDataError, selectDataLoading, selectDataState } from './selectors';
import type { RootState } from '..';

describe('data selectors', () => {
  const state: RootState = {
    data: {
      data: [],
      loading: true,
      error: 'Request failed',
    },
  };

  it('should select the data state slice', () => {
    expect(selectDataState(state)).toEqual(state.data);
  });

  it('should select data', () => {
    expect(selectData(state)).toEqual(state.data.data);
  });

  it('should select loading', () => {
    expect(selectDataLoading(state)).toBe(true);
  });

  it('should select error', () => {
    expect(selectDataError(state)).toBe('Request failed');
  });
});
