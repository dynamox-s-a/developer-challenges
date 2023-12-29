import { HighchartsReactRefObject } from 'highcharts-react-official';

type TDataChart = {
  datetime: string;
  max: number;
};

export type TDataChartLine = {
  axisName?: string;
  range: Array<string>;
  series: Array<[string, number]>;
};

export type TResponseChart = {
  data: Array<TDataChart>;
  name: string;
};

export interface TChart extends TResponseChart {
  id: string;
  lines: Array<TDataChartLine>;
  status: '' | 'loading' | 'error' | 'success';
  title: string;
  yAxisTitle: string;
}

export interface TLineChart extends TChart {
  ref: React.RefObject<HighchartsReactRefObject>;
}

export type TCardItem = {
  icon: unknown;
  title: string;
  xs: number;
};
