export enum SensorModel {
  TcAg = 'TcAg',
  TcAs = 'TcAs',
  HF_PLUS = 'HF_PLUS',
}

export interface Sensor {
  id: number;
  model: SensorModel;
  monitoringPointId: number;
}

