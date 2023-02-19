import * as React from 'react';
import { GridApiCommon } from '../../models/api/gridApiCommon';
import { GridApiCommunity } from '../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
export declare type GridStateInitializer<P extends Partial<DataGridProcessedProps> = DataGridProcessedProps, Api extends GridApiCommon = GridApiCommunity> = (state: DeepPartial<Api['state']>, props: P, apiRef: React.MutableRefObject<Api>) => DeepPartial<Api['state']>;
export declare const useGridInitializeState: <P extends Partial<DataGridProcessedProps<any>>, Api extends GridApiCommon = GridApiCommunity>(initializer: GridStateInitializer<P, Api>, apiRef: React.MutableRefObject<Api>, props: P) => void;
export {};
