import {ISensor} from "../Sensor/ISensor.ts";

export type IMachine = {
  _id?: string;
  name: string;
  type: string;
  monitoringPoint: ISensor[] | [{},{}];
};
