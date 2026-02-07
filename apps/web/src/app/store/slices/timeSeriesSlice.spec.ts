import { configureStore } from '@reduxjs/toolkit';
import timeSeriesReducer, { clearTimeSeries } from './timeSeriesSlice';

const createStore = () =>
  configureStore({
    reducer: { timeSeries: timeSeriesReducer },
  });

describe('timeSeriesSlice', () => {
  it('initial state has empty data', () => {
    const store = createStore();
    expect(store.getState().timeSeries.data).toEqual([]);
    expect(store.getState().timeSeries.loading).toBe(false);
  });

  it('clearTimeSeries resets data', () => {
    const store = createStore();
    store.dispatch(
      clearTimeSeries()
    );
    expect(store.getState().timeSeries.data).toEqual([]);
  });
});
