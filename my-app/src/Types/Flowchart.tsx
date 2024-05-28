
interface IDataPoint {
  datetime: string;
  max: number;
}

interface IFlowchart {
  name: string;
  data: IDataPoint[];
}

export interface IFlowchartState {
  data: IFlowchart,
  loading: boolean,
  error: boolean,
} 