import { RemoteMonitoringPointType } from '../../types/remote-monitoring-point-type';

export interface HeadCell {
  disablePadding: boolean;
  id: keyof RemoteMonitoringPointType;
  label: string;
  numeric: boolean;
}

export const headCells: readonly HeadCell[] = [
  {
    id: '_id',
    numeric: false,
    disablePadding: true,
    label: 'ID',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'userId',
    numeric: false,
    disablePadding: false,
    label: 'User ID',
  },
  {
    id: 'machineId',
    numeric: false,
    disablePadding: false,
    label: 'Machine ID',
  },
  {
    id: 'machineName',
    numeric: false,
    disablePadding: false,
    label: 'Machine Name',
  },
  {
    id: 'machineStatus',
    numeric: false,
    disablePadding: false,
    label: 'Machine Status',
  },
  {
    id: 'machineType',
    numeric: false,
    disablePadding: false,
    label: 'Machine Type',
  },
  {
    id: 'sensorId',
    numeric: false,
    disablePadding: false,
    label: 'Sensor ID',
  },
  {
    id: 'sensorModelName',
    numeric: false,
    disablePadding: false,
    label: 'Sensor Model Name',
  },
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: 'Created At',
  },
  {
    id: 'updatedAt',
    numeric: false,
    disablePadding: false,
    label: 'Updated At',
  },
];
