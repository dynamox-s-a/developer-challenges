export const VALID_SENSOR_MODELS = ["TcAg", "TcAs", "HF+"] as const;
export type SensorModel = typeof VALID_SENSOR_MODELS[number];