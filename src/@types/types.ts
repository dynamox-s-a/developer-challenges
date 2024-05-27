export interface MeasureItem {
  datetime: string;
  max: number;
}

export interface Measure {
  name: string;
  data: MeasureItem[];
}

export interface MeasureApiResponse {
  data: Measure[]
}