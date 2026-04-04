export type TimeSeriesMetrics = {
  seriesId: string;
  unit: string;
  totalPoints: number;
  minValue: number;
  maxValue: number;
  averageValue: number;
  firstTimestamp: Date;
  lastTimestamp: Date;
};
