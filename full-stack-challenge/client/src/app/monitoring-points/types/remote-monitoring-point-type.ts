import {
  MachineStatus,
  MachineTypes,
} from '../../machine/components/machine-creation-form';

export interface RemoteMonitoringPointType {
  name: string;
  userId: string;
  sensorId: string;
  sensorModelName: string;
  machineId: string;
  machineName: string;
  machineStatus: MachineStatus;
  machineType: MachineTypes;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
