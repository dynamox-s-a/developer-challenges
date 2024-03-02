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
  monitoringPoints?: MonitoringPointType[] | IntermediateMonitoringType[];
}

export interface MonitoringPointType {
  name: string;
  userId?: string;
  sensorId: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
}

export interface IntermediateMonitoringType {
  modelName: string;
  userId: string;
  _id: string;
  deleted: boolean;
  sensors: Sensor[];
}

export interface Sensor {
  _id: string;
  modelName: string;
  createdAt: string;
}
