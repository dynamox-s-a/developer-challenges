import { productReducer } from '@/slices/editSlic';
import {
    Action,
    configureStore,
    ThunkAction,
  } from '@reduxjs/toolkit';
  import { createWrapper } from 'next-redux-wrapper';
  
  
  
  export const makeStore = () =>
    configureStore({
      reducer:{
        edit: productReducer
      }
    });
  
  type Store = ReturnType<typeof makeStore>;
  
  export type AppDispatch = Store['dispatch'];
  export type RootState = ReturnType<Store['getState']>;
  export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
  >;
  
  export const wrapper = createWrapper(makeStore, { debug: true });