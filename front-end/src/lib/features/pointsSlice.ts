import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type MonitoringPoint = {
    id: number;
    machineId: number;
    machineName: string;
    machineType: string;
    name: string;
    model: string;
}

// Define a type for the slice state
export interface PointsState {
    monitoringPoints: MonitoringPoint[];
    machineName: string;
    machineType: string;
    machineId: number;
    editPoints: MonitoringPoint[];
}
  
// Define the initial state using that type
const initialState: PointsState = {
    monitoringPoints: [],
    machineName: '',
    machineType: '',
    machineId: 0,
    editPoints: [],
}

export const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    changeMonitoringPoints: (state, action) => {
      state.monitoringPoints = action.payload.points;
    },
    createNew: state => {
        state.machineName = '';
        state.machineType = '';
        state.machineId = 0;
        state.editPoints = [];
    },
    editMachine: (state, action) => {
        state.machineName = action.payload.machineName
        state.machineType = action.payload.machineType
        state.machineId = action.payload.machineId
        state.editPoints = action.payload.editPoints
    }
  }
})

// Action creators are generated for each case reducer function
export const { changeMonitoringPoints, createNew, editMachine } = pointsSlice.actions

export default pointsSlice.reducer