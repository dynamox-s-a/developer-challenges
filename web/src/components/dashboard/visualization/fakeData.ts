import type { GridColDef } from '@mui/x-data-grid'

export const rawRows = []

export const columns: GridColDef[] = [
  {
    field: 'machineName',
    headerName: 'Machine Name',
    flex: 1,
    minWidth: 150,
    editable: false,
  },
  {
    field: 'machineType',
    headerName: 'Machine Type',
    flex: 1,
    minWidth: 150,
    editable: false,
  },
  {
    field: 'monitoringPoint',
    headerName: 'Monitoring Point',
    flex: 1,
    minWidth: 150,
    editable: false,
  },
  {
    field: 'sensorModel',
    headerName: 'Sensor Model',
    flex: 1,
    minWidth: 150,
    editable: false,
  },
]
