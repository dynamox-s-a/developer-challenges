type TDataChart = {
  datetime: string;
  max: number;
};

type TDataChartLine = {
  name?: string;
  xAxioData: Array<string>;
  yAxioData: Array<number>;
};

export type TResponseChart = {
  data: Array<TDataChart>;
  name: string;
};

export interface TChart extends TResponseChart {
  id: string;
  lines?: Array<TDataChartLine>;
  title: string;
  yAxisTitle: string;
}
