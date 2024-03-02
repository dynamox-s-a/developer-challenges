import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../core/libs/axios';
import { MACHINE_PATH } from '../../machine/actions';
import {
  MachineStatus,
  MachineTypes,
} from '../../machine/components/machine-creation-form';
import {
  IntermediateMonitoringType,
  MachineType,
} from '../../machine/types/machine-type';
import { RemoteMonitoringPointType } from '../../monitoring-points/types/remote-monitoring-point-type';

function createData(
  _id: string,
  name: string,
  userId: string,
  machineId: string,
  machineName: string,
  machineStatus: MachineStatus,
  machineType: MachineTypes,
  sensorId: string,
  sensorModelName: string,
  createdAt: string,
  updatedAt: string
): RemoteMonitoringPointType {
  return {
    _id,
    name,
    userId,
    machineId,
    machineName,
    machineStatus,
    machineType,
    sensorId,
    sensorModelName,
    createdAt,
    updatedAt,
  };
}

export const rows = [
  createData(
    '65e116ca8de116651ed293be',
    'Ponto 1',
    '65e0d081ff18f780a53dea47',
    '65e0df7ebbdd64de59e38947',
    'Maquina 1',
    MachineStatus.ACTIVE,
    MachineTypes.PUMP,
    '65e10cd54e3ae2d28c65d59f',
    'HF+',
    '2024-02-29T19:48:14.839+00:0',
    '2024-02-29T19:48:14.839+00:0'
  ),
  createData(
    '65e126ca8de116651ed293be',
    'Ponto 2',
    '65e0d081ff18f780a53dea47',
    '65e0df7ebbdd64de59e38947',
    'Maquina 2',
    MachineStatus.ACTIVE,
    MachineTypes.FAN,
    '65e10cd54e3ae2d28c65d59f',
    'HF+',
    '2024-02-29T19:48:14.839+00:0',
    '2024-02-29T19:48:14.839+00:0'
  ),
  createData(
    '65e136ca8de116651ed293be',
    'Ponto 3',
    '65e0d081ff18f780a53dea47',
    '65e0df7ebbdd64de59e38947',
    'Maquina 3',
    MachineStatus.ACTIVE,
    MachineTypes.PUMP,
    '65e10cd54e3ae2d28c65d59f',
    'HF+',
    '2024-02-29T19:48:14.839+00:0',
    '2024-02-29T19:48:14.839+00:0'
  ),
  createData(
    '65e146ca8de116651ed293be',
    'Ponto 4',
    '65e0d081ff18f780a53dea47',
    '65e0df7ebbdd64de59e38947',
    'Maquina 4',
    MachineStatus.ACTIVE,
    MachineTypes.FAN,
    '65e10cd54e3ae2d28c65d59f',
    'HF+',
    '2024-02-29T19:48:14.839+00:0',
    '2024-02-29T19:48:14.839+00:0'
  ),
  createData(
    '65e156ca8de116651ed293be',
    'Ponto 5',
    '65e0d081ff18f780a53dea47',
    '65e0df7ebbdd64de59e38947',
    'Maquina 5',
    MachineStatus.ACTIVE,
    MachineTypes.PUMP,
    '65e10cd54e3ae2d28c65d59f',
    'HF+',
    '2024-02-29T19:48:14.839+00:0',
    '2024-02-29T19:48:14.839+00:0'
  ),
  createData(
    '65e166ca8de116651ed293be',
    'Ponto 6',
    '65e0d081ff18f780a53dea47',
    '65e0df7ebbdd64de59e38947',
    'Maquina 6',
    MachineStatus.ACTIVE,
    MachineTypes.FAN,
    '65e10cd54e3ae2d28c65d59f',
    'HF+',
    '2024-02-29T19:48:14.839+00:0',
    '2024-02-29T19:48:14.839+00:0'
  ),
  createData(
    '65e176ca8de116651ed293be',
    'Ponto 7',
    '65e0d081ff18f780a53dea47',
    '65e0df7ebbdd64de59e38947',
    'Maquina 7',
    MachineStatus.ACTIVE,
    MachineTypes.FAN,
    '65e10cd54e3ae2d28c65d59f',
    'HF+',
    '2024-02-29T19:48:14.839+00:0',
    '2024-02-29T19:48:14.839+00:0'
  ),
  createData(
    '65e186ca8de116651ed293be',
    'Ponto 8',
    '65e0d081ff18f780a53dea47',
    '65e0df7ebbdd64de59e38947',
    'Maquina 8',
    MachineStatus.ACTIVE,
    MachineTypes.FAN,
    '65e10cd54e3ae2d28c65d59f',
    'HF+',
    '2024-02-29T19:48:14.839+00:0',
    '2024-02-29T19:48:14.839+00:0'
  ),
  createData(
    '65e196ca8de116651ed293be',
    'Ponto 9',
    '65e0d081ff18f780a53dea47',
    '65e0df7ebbdd64de59e38947',
    'Maquina 9',
    MachineStatus.ACTIVE,
    MachineTypes.FAN,
    '65e10cd54e3ae2d28c65d59f',
    'HF+',
    '2024-02-29T19:48:14.839+00:0',
    '2024-02-29T19:48:14.839+00:0'
  ),
  createData(
    '65e1a6ca8de116651ed293be',
    'Ponto 10',
    '65e0d081ff18f780a53dea47',
    '65e0df7ebbdd64de59e38947',
    'Maquina 10',
    MachineStatus.ACTIVE,
    MachineTypes.FAN,
    '65e10cd54e3ae2d28c65d59f',
    'HF+',
    '2024-02-29T19:48:14.839+00:0',
    '2024-02-29T19:48:14.839+00:0'
  ),
  createData(
    '65e1b6ca8de116651ed293be',
    'Ponto 11',
    '65e0d081ff18f780a53dea47',
    '65e0df7ebbdd64de59e38947',
    'Maquina 11',
    MachineStatus.ACTIVE,
    MachineTypes.FAN,
    '65e10cd54e3ae2d28c65d59f',
    'HF+',
    '2024-02-29T19:48:14.839+00:0',
    '2024-02-29T19:48:14.839+00:0'
  ),
  createData(
    '65e1c6ca8de116651ed293be',
    'Ponto 11',
    '65e0d081ff18f780a53dea47',
    '65e0df7ebbdd64de59e38947',
    'Maquina 12',
    MachineStatus.INACTIVE,
    MachineTypes.FAN,
    '65e10cd54e3ae2d28c65d59f',
    'HF+',
    '2024-02-29T19:48:14.839+00:0',
    '2024-02-29T19:48:14.839+00:0'
  ),
  createData(
    '65e1d6ca8de116651ed293be',
    'Ponto 13',
    '65e0d081ff18f780a53dea47',
    '65e0df7ebbdd64de59e38947',
    'Maquina 13',
    MachineStatus.INACTIVE,
    MachineTypes.FAN,
    '65e10cd54e3ae2d28c65d59f',
    'HF+',
    '2024-02-29T19:48:14.839+00:0',
    '2024-02-29T19:48:14.839+00:0'
  ),
];

const POINTS_PATH = 'by-monitoring-points';

const initialState: {
  monitoringPoints: RemoteMonitoringPointType[];
  status: 'success' | 'pending' | 'error' | 'idle';
} = { monitoringPoints: [], status: 'idle' };

export const fetchPointsByUser = createAsyncThunk(
  'monitoring-points',
  async (userId: string, thunkAPI) => {
    try {
      const response = await api.get(
        `${MACHINE_PATH}/${POINTS_PATH}/${userId}`
      );

      return response.data;
    } catch (error: any) {
      console.log({ error });
    }
  }
);

const monitoringPointsSlice = createSlice({
  name: 'monitoringPoints',
  initialState: initialState,
  reducers: {
    addmonitoringPoints: (state, action) => {
      state.monitoringPoints.push(...action.payload);
    },
    addmonitoringPoint: (
      state,
      action: PayloadAction<RemoteMonitoringPointType>
    ) => {
      const {
        _id,
        name,
        userId,
        sensorId,
        sensorModelName,
        machineId,
        machineName,
        machineStatus,
        machineType,
        createdAt,
        updatedAt,
      } = action.payload;
      state.monitoringPoints.push({
        _id,
        name,
        userId,
        sensorId,
        sensorModelName,
        machineId,
        machineName,
        machineStatus,
        machineType,
        createdAt,
        updatedAt,
      });
    },
    updatemonitoringPoint: (
      state,
      action: PayloadAction<RemoteMonitoringPointType>
    ) => {
      const {
        _id,
        name,
        userId,
        sensorId,
        sensorModelName,
        machineId,
        machineName,
        machineStatus,
        machineType,
        createdAt,
        updatedAt,
      } = action.payload;
      const pointIndex = state.monitoringPoints.findIndex(
        (point: RemoteMonitoringPointType) => point._id === _id
      );
      if (pointIndex !== -1) {
        state.monitoringPoints[pointIndex].name = name;
        state.monitoringPoints[pointIndex].userId = userId;
        state.monitoringPoints[pointIndex].sensorModelName = sensorModelName;

        state.monitoringPoints[pointIndex].sensorId = sensorId;

        state.monitoringPoints[pointIndex].machineId = machineId;

        state.monitoringPoints[pointIndex].machineName = machineName;

        state.monitoringPoints[pointIndex].machineStatus = machineStatus;

        state.monitoringPoints[pointIndex].machineType = machineType;

        state.monitoringPoints[pointIndex].createdAt = createdAt;
        state.monitoringPoints[pointIndex].updatedAt = updatedAt;
      }
    },
    deletemonitoringPoint: (
      state,
      action: PayloadAction<keyof RemoteMonitoringPointType>
    ) => {
      const pointId = action.payload;
      const newState = state.monitoringPoints.filter(
        (point: RemoteMonitoringPointType) => point._id !== pointId
      );
      return { monitoringPoints: newState, status: 'idle' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPointsByUser.pending, (state, action) => {
        state.status = 'pending';
      })
      .addCase(fetchPointsByUser.fulfilled, (state, action) => {
        const monitoringPoints = action.payload.map((machine: MachineType) =>
          machine?.monitoringPoints?.map((point) => ({
            _id: point?._id,
            name: (point as IntermediateMonitoringType)?.modelName || '-',
            userId: point?.userId,
            sensorId: (point as IntermediateMonitoringType)?.sensors?.[0]._id,
            sensorModelName: (point as IntermediateMonitoringType)?.sensors?.[0]
              .modelName,
            machineId: machine?._id,
            machineName: machine?.name,
            machineStatus: machine?.status,
            machineType: machine?.type,
            createdAt: machine?.createdAt || '-',
            updatedAt: machine?.updatedAt || '-',
          }))
        );
        state.monitoringPoints = monitoringPoints;
        state.status = 'success';
      })
      .addCase(fetchPointsByUser.rejected, (state, action) => {
        state.status = 'error';
      });

    // builder.addCase(savePerson.fulfilled, (state, action) => {
    //   state.monitoringPoints.persons.push(action.payload);
    // });
  },
});

export const {
  addmonitoringPoints,
  addmonitoringPoint,
  updatemonitoringPoint,
  deletemonitoringPoint,
} = monitoringPointsSlice.actions;
export default monitoringPointsSlice.reducer;
