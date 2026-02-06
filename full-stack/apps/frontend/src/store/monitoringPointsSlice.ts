import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api";

export type SortOrder = "asc" | "desc";

export type MonitoringPointRow = {
  id: string;
  monitoringPointName: string;
  machineName: string;
  machineType: "Pump" | "Fan";
  sensorModel: "TcAg" | "TcAs" | "HF_plus" | null;
  sensorUniqueId: string | null;
  createdAt: string;
};

export type MonitoringPointsResponse = {
  items: MonitoringPointRow[];
  total: number;
  take: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
};

type State = {
  items: MonitoringPointRow[];
  total: number;
  loading: boolean;
  error: string | null;

  // table state
  pageSize: number; // take
  page: number;     // skip = page * pageSize
  sortBy: "machineName" | "machineType" | "monitoringPointName" | "sensorModel" | "createdAt";
  sortOrder: SortOrder;
};

const initialState: State = {
  items: [],
  total: 0,
  loading: false,
  error: null,

  pageSize: 5,
  page: 0,
  sortBy: "machineName",
  sortOrder: "asc",
};

export const fetchMonitoringPoints = createAsyncThunk(
  "monitoringPoints/fetch",
  async (_, { getState }) => {
    const state = getState() as { monitoringPoints: State };
    const mp = state.monitoringPoints;

    const take = mp.pageSize;
    const skip = mp.page * mp.pageSize;

    const res = await api.get<MonitoringPointsResponse>("/monitoring-points", {
      params: {
        take,
        skip,
        sortBy: mp.sortBy,
        sortOrder: mp.sortOrder,
      },
    });

    return res.data;
  }
);

const slice = createSlice({
  name: "monitoringPoints",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 0;
    },
    setSort(state, action: PayloadAction<{ sortBy: State["sortBy"]; sortOrder: SortOrder }>) {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      state.page = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitoringPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchMonitoringPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch monitoring points";
      });
  },
});

export const { setPage, setPageSize, setSort } = slice.actions;
export default slice.reducer;