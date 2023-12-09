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

export interface ITextFieldProps {
  formRef: {
    name: string;
    formHook: UseFormReturn<any>;
  };
  label: string;
}
