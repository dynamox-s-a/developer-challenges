import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk, RootState } from "../../../src/store";
import { DataItem } from "../../components/DynamicChart";
import { SeriesLineOptions } from "highcharts";

interface DataState {
  seriesById: {
    [chartId: string]: SeriesLineOptions[];
  };
  status: "idle" | "loading" | "failed";
}

const initialState: DataState = {
  seriesById: {},
  status: "idle",
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setData: (
      state,
      action: PayloadAction<{
        chartId: string;
        series: SeriesLineOptions[];
      }>
    ) => {
      const { chartId, series } = action.payload;
      state.seriesById[chartId] = series;
      state.status = "idle";
    },
    setLoading: (state) => {
      state.status = "loading";
    },
    setError: (state) => {
      state.status = "failed";
    },
  },
});

const { actions } = dataSlice;
const { setData, setLoading, setError } = actions;

export const fetchData =
  (
    chartId: string,
    urls: string[],
    seriesNames: string[],
    lineColors: string[]
  ): AppThunk =>
  async (dispatch) => {
    dispatch(setLoading());
    try {
      const seriesData = await Promise.all(
        urls.map(async (url, index) => {
          const response = await axios.get<{ data: DataItem[] }>(url);
          return {
            type: "line" as const,
            name: seriesNames[index],
            data: response.data.data.map((item) => ({
              x: new Date(item.datetime).getTime(),
              y: item.max,
            })),
            color: lineColors[index],
          } as SeriesLineOptions;
        })
      );
      dispatch(setData({ chartId, series: seriesData }));
    } catch (error) {
      dispatch(setError());
    }
  };

export const selectData = (chartId: string) => (state: RootState) =>
  state.data.seriesById[chartId] || [];
export default dataSlice.reducer;
