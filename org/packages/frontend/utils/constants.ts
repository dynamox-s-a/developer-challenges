export enum MachineType {
  Pump = 'Pump',
  Fan = 'Fan',
}

export const MACHINE_OPTIONS = [MachineType.Pump, MachineType.Fan];

export enum SensorModel {
  TcAg = 'TcAg',
  TcAs = 'TcAs',
  HFp = 'HF+',
}

export const SENSOR_MODEL_OPTIONS = [
  SensorModel.TcAg,
  SensorModel.TcAs,
  SensorModel.HFp,
];
