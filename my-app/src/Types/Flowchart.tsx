
export interface IDataPoint {
  datetime: string;
  max: number;
}

export interface IFlowchart {
  [x: string]: any;
  name: string;
  data: IDataPoint[];
}

export interface IFlowchartState {
  data: IFlowchart,
  loading: boolean,
  error: boolean,
} 