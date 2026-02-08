import { createSlice } from '@reduxjs/toolkit';
import {
    fetchMachinesThunk,
    createMachineThunk,
    deleteMachineThunk,
    updateMachineThunk,
} from './machinesThunks';

export type Machine = {
    id: string | number;
    name: string;
    type: 'Pump' | 'Fan';
};

type State = {
    items: Machine[];
    status: 'idle' | 'loading' | 'failed';
    error: string | null;
};

const initialState: State = { items: [], status: 'idle', error: null };

const slice = createSlice({
    name: 'machines',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchMachinesThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchMachinesThunk.fulfilled, (state, a) => {
                state.status = 'idle';
                state.items = a.payload.items;
            })
            .addCase(fetchMachinesThunk.rejected, (state, a) => {
                state.status = 'failed';
                state.error = a.error.message || 'Error';
            })
            .addCase(createMachineThunk.fulfilled, (state, a) => {
                state.items.unshift(a.payload);
            })
            .addCase(updateMachineThunk.fulfilled, (state, action) => {
                const idx = state.items.findIndex((m) => Number(m.id) === Number(action.meta.arg.id));
                if (idx >= 0) (state.items as Record<string, any>[])[idx] = action.payload;
            })
            .addCase(deleteMachineThunk.fulfilled, (state, a) => {
                state.items = state.items.filter(
                    (m) => String(m.id) !== String(a.meta.arg),
                );
            });
    },
});

export default slice.reducer;
