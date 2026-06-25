export type DataPoint = {
    datetime: string;
    max: number;
};

export type RawSeries = {
    name: string;
    data: DataPoint[];
};
