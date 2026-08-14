export interface DataPoint {
  datetime: string;
  max: number;
}

export interface Data {
  name: string;
  data: DataPoint[];
}
