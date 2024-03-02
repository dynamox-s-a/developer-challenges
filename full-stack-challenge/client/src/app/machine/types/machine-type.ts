import {
  MachineStatus,
  MachineTypes,
} from '../components/machine-creation-form';

export interface MachineType {
  _id?: string;
  name: string;
  status?: MachineStatus;
  createdAt?: string;
  type: MachineTypes;
  updatedAt?: string;
  deleted?: boolean;
  monitoringPoints?: MonitoringPointType[];
}

export interface MonitoringPointType {
  name: string;
  userId: string;
  sensorId: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
}
