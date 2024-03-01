export interface MachineType {
  _id?: string;
  name: string;
  status?: string;
  createdAt?: string;
  type: string;
  updatedAt?: string;
  deleted?: boolean;
  monitoringPoints?: MonitoringPointType[];
}

export interface MonitoringPointType {
  userId: string;
  sensorId: string;
  _id: string;
  deleted: boolean;
}
