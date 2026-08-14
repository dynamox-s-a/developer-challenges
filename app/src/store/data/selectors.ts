import type { RootState } from '../index';

export const selectData = (state: RootState) => state.data.data;

export const selectDataLoading = (state: RootState) => state.data.loading;

export const selectDataError = (state: RootState) => state.data.error;
