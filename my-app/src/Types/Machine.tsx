
export interface IDataPoint {
  datetime: string;
  max: number;
}

export interface IMachine {
  machine: string;
  point: string;
  rpm: string;
  diff: string;
  time: string;
}

export interface IMachineState {
  data: IMachine[],
  loading: boolean,
  error: boolean,
} 