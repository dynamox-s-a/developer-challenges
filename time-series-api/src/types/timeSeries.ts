export interface Sample {
  timestamp: Date;
  value: number;
}

export interface TimeSeries {
  name?: string;
  samples: Sample[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TimeSeriesMetrics {
  count: number;
  min: number;
  max: number;
  average: number;
  sum: number;
  range: number;
  firstTimestamp: Date;
  lastTimestamp: Date;
}