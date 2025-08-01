import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type MachineType = 'Pump' | 'Fan';

export interface Machine {
    id: string;
    name: string;
    type: MachineType;
}

interface MachinesState {
    list: Machine[];
}

const initialState: MachinesState = {
    list: [],
};

const machinesSlice = createSlice({
    name: 'machines',
    initialState,
    reducers: {
        addMachine: (state, action: PayloadAction<Machine>) => {
            state.list.push(action.payload);
        },
        updateMachine: (state, action: PayloadAction<Machine>) => {
            const index = state.list.findIndex(m => m.id === action.payload.id);
            if (index >= 0) state.list[index] = action.payload;
        },
        deleteMachine: (state, action: PayloadAction<string>) => {
            state.list = state.list.filter(m => m.id !== action.payload);
        },
    },
});

export const { addMachine, updateMachine, deleteMachine } = machinesSlice.actions;
export default machinesSlice.reducer;
