import { createSlice } from '@reduxjs/toolkit';
import {
    fetchMonitoringPointsThunk,
    type MPRow,
} from './monitoringPointsThunks';

type State = {
    items: MPRow[];
    total: number;
    page: number;
    pageSize: number;
    sort: string;
    dir: 'asc' | 'desc';
    status: 'idle' | 'loading' | 'failed';
    error: string | null;
};

const initialState: State = {
    items: [],
    total: 0,
    page: 1,
    pageSize: 5,
    sort: 'machineName',
    dir: 'asc',
    status: 'idle',
    error: null,
};

const slice = createSlice({
    name: 'monitoringPoints',
    initialState,
    reducers: {
        setTableState(
            state,
            action: {
                payload: Partial<
                    Pick<State, 'page' | 'pageSize' | 'sort' | 'dir'>
                >;
            },
        ) {
            Object.assign(state, action.payload);
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchMonitoringPointsThunk.pending, (s) => {
                s.status = 'loading';
                s.error = null;
            })
            .addCase(fetchMonitoringPointsThunk.fulfilled, (s, a) => {
                s.status = 'idle';
                s.items = a.payload.items;
                s.total = a.payload.total;
                s.page = a.payload.page;
                s.pageSize = a.payload.pageSize;
            })
            .addCase(fetchMonitoringPointsThunk.rejected, (s, a) => {
                s.status = 'failed';
                s.error =
                    a.error.message || 'Failed to fetch monitoring points';
            });
    },
});

export const { setTableState } = slice.actions;
export default slice.reducer;
