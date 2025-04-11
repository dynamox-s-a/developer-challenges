export const toDbModel = (model: string): string => {
  return model === "HF_Plus" ? "HF+" : model;
};

export const fromDbModel = (model: string): string => {
  return model === "HF+" ? "HF_Plus" : model;
};

export const SENSOR_MODELS = ["TcAg", "TcAs", "Other"] as const;

export type SensorModelType = (typeof SENSOR_MODELS)[number];

export interface DisplaySensorModel {
  id: SensorModelType;
  label: string;
}

export const toDisplayModel = (model: SensorModelType): DisplaySensorModel => {
  switch (model) {
    case "TcAg":
      return { id: model, label: "Sensor TcAg" };
    case "TcAs":
      return { id: model, label: "Sensor TcAs" };
    case "Other":
      return { id: model, label: "Outro Sensor" };
    default:
      return { id: model, label: model };
  }
};

export const toInternalModel = (label: string): SensorModelType => {
  switch (label) {
    case "Sensor TcAg":
      return "TcAg";
    case "Sensor TcAs":
      return "TcAs";
    case "Outro Sensor":
      return "Other";
    default:
      return label as SensorModelType;
  }
};
