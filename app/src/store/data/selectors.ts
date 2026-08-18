import type { RootState } from '../index';

export const selectDataState = (state: RootState) => state.data;

export const selectData = (state: RootState) => selectDataState(state).data;

export const selectDataLoading = (state: RootState) => selectDataState(state).loading;

export const selectDataError = (state: RootState) => selectDataState(state).error;
