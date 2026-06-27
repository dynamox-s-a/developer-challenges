export type Machine = {
    name: string;
    point: string;
    rpm: number;
    dynamicRange: string;
    sampleInterval: string;
};

export type DataPoint = {
    datetime: string;
    max: number;
};

export type RawSeries = {
    name: string;
    data: DataPoint[];
};
