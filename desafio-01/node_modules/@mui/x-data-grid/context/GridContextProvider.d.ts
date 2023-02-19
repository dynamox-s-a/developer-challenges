import * as React from 'react';
import { GridApiCommunity } from '../models/api/gridApiCommunity';
declare type GridContextProviderProps = {
    apiRef: React.MutableRefObject<GridApiCommunity>;
    props: {};
    children: React.ReactNode;
};
export declare const GridContextProvider: ({ apiRef, props, children }: GridContextProviderProps) => JSX.Element;
export {};
