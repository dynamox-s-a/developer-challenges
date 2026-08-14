import type { AnyAction } from 'redux';

import { DataActionTypes, type DataState } from './types';

const initialState: DataState = {
  data: [],
  loading: false,
  error: null,
};

export function dataReducer(state = initialState, action: AnyAction): DataState {
  switch (action.type) {
    case DataActionTypes.FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case DataActionTypes.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case DataActionTypes.FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}
