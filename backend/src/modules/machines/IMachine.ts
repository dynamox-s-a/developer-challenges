import { ISensor } from "../sensors/ISensor";

export interface IMachine {
  _id?: string;
  name: string;
  type: string;
  monitoringPoint: ISensor[];
}
