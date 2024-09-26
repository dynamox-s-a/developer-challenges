import { ISensor } from "./MachineForm";

export type IMachine = {
  _id?: string;
  name: string;
  type: string;
  monitoringPoint: ISensor[] | [];
};
