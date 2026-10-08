export const MachineType = {
  Pump: 'Pump',
  Fan: 'Fan',
} as const;
export type MachineType = (typeof MachineType)[keyof typeof MachineType];

// Prisma can't name an enum value "HF+", so the DB stores the key (HFPlus)
// while the API and UI use the value ("HF+").
export const SensorModel = {
  TcAg: 'TcAg',
  TcAs: 'TcAs',
  HFPlus: 'HF+',
} as const;
export type SensorModel = (typeof SensorModel)[keyof typeof SensorModel];

/** The SensorModel key, which is what the database stores (`HFPlus`). */
export type SensorModelKey = keyof typeof SensorModel;

export function sensorModelFromKey(key: SensorModelKey): SensorModel {
  return SensorModel[key];
}

export function sensorModelToKey(model: SensorModel): SensorModelKey {
  const key = (Object.keys(SensorModel) as SensorModelKey[]).find(
    (candidate) => SensorModel[candidate] === model,
  );
  if (!key) throw new Error(`Unknown sensor model: ${model}`);
  return key;
}
