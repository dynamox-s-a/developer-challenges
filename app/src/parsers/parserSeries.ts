type DataPoint = {
  datetime: number | string;
  max: number;
};

type DataItem = {
  name: string;
  data: DataPoint[];
};

type Series = {
  name: string;
  type: 'line';
  data: [number | string, number][];
};

export function parseSeries(data: DataItem[] = [], indexes: number[] = []): Series[] {
  return indexes
    .map((index) => data[index])
    .filter((item): item is DataItem => Boolean(item))
    .map((item) => ({
      name: item.name,
      type: 'line',
      data: item.data.map((point) => [point.datetime, point.max]),
    }));
}
