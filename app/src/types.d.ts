import { UseFormReturn } from "react-hook-form/dist/types/form";

export enum Sensors {
  "TcAg",
  "TcAs",
  "HF+",
}

export enum MachineTypes {
  "Pump",
  "Fan",
}
export interface IUser {
  id: number;
  email: string;
  password: string;
}

export interface IMonitoringPoint {
  id: number;
  name: string;
  machineId: number;
  sensor: Sensors;
}

export interface ITextFieldProps {
  formRef: {
    name: string;
    formHook: UseFormReturn<any>;
  };
  label: string;
}
