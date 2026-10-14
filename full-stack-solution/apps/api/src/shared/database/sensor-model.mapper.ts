import type { SensorModel } from "@full-stack-solution/shared";
import type { SensorModel as DbSensorModel } from "../../generated/prisma/client";

const TO_DOMAIN: Record<DbSensorModel, SensorModel> = {
  HF_PLUS: "HF+",
  TcAg: "TcAg",
  TcAs: "TcAs",
};

const TO_DATABASE: Record<SensorModel, DbSensorModel> = {
  "HF+": "HF_PLUS",
  TcAg: "TcAg",
  TcAs: "TcAs",
};

export const toDomainSensorModel = (model: DbSensorModel): SensorModel =>
  TO_DOMAIN[model];

export const toDatabaseSensorModel = (model: SensorModel): DbSensorModel =>
  TO_DATABASE[model];
