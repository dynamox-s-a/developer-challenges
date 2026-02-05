export const SENSOR_TYPES = {
  TCAG: 'TcAg',
  TCAS: 'TcAs',
  HF_PLUS: 'HF+',
} as const;

export type SensorType = (typeof SENSOR_TYPES)[keyof typeof SENSOR_TYPES];

export const SENSOR_TYPE_VALUES = Object.values(SENSOR_TYPES);
