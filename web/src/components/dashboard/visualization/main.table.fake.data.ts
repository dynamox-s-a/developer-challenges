import type { GridColDef } from '@mui/x-data-grid'

export const rawRows = [
  { id: '1', machineName: 'Roberto', machineType: 'Pump', sensorModel: 'TcAg' },
  {
    id: '2',
    machineName: 'Máquina A',
    machineType: 'Fan',
    monitoringPoint: 'Temperatura do Rolamento',
    sensorModel: 'HF+',
  },
  {
    id: '3',
    machineName: 'Compressor B',
    machineType: 'Pump',
    monitoringPoint: 'Pressão do Sistema',
    sensorModel: 'TcAs',
  },
  {
    id: '4',
    machineName: 'Ventilador C',
    machineType: 'Fan',
    monitoringPoint: 'Vibração da Hélice',
    sensorModel: 'HF+',
  },
  {
    id: '5',
    machineName: 'Bomba D',
    machineType: 'Pump',
    monitoringPoint: 'Vazão do Fluido',
    sensorModel: 'TcAg',
  },
  {
    id: '6',
    machineName: 'Turbina E',
    machineType: 'Pump',
    monitoringPoint: 'Rotação do Eixo',
    sensorModel: 'HF+',
  },
  {
    id: '7',
    machineName: 'Gerador F',
    machineType: 'Fan',
    monitoringPoint: 'Temperatura do Óleo',
    sensorModel: 'TcAs',
  },
  { id: '8', machineName: 'Motor G', machineType: 'Pump', sensorModel: 'TcAg' },
  {
    id: '9',
    machineName: 'Ventoinha H',
    machineType: 'Fan',
    monitoringPoint: 'Pressão do Ar',
    sensorModel: 'HF+',
  },
  {
    id: '10',
    machineName: 'Bomba I',
    machineType: 'Pump',
    monitoringPoint: 'Nível do Tanque',
  },
]

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

export const stats = {
  machines: 10,
  sensors: 25,
  monitoringPoints: 15,
}
