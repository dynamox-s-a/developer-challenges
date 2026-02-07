import { configureStore } from '@reduxjs/toolkit';
import machinesReducer from './machinesSlice';

const createStore = () =>
  configureStore({
    reducer: { machines: machinesReducer },
  });

describe('machinesSlice', () => {
  it('initial state has empty items', () => {
    const store = createStore();
    expect(store.getState().machines.items).toEqual([]);
    expect(store.getState().machines.loading).toBe(false);
  });
});
