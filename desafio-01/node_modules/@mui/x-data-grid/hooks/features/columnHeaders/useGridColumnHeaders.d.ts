import * as React from 'react';
import { GridRenderContext } from '../../../models/params/gridScrollParams';
interface UseGridColumnHeadersProps {
    innerRef?: React.Ref<HTMLDivElement>;
    minColumnIndex?: number;
}
interface GetHeadersParams {
    renderContext: GridRenderContext | null;
    minFirstColumn?: number;
    maxLastColumn?: number;
}
export declare const useGridColumnHeaders: (props: UseGridColumnHeadersProps) => {
    renderContext: GridRenderContext | null;
    getColumnHeaders: (params?: GetHeadersParams, other?: {}) => JSX.Element | null;
    getColumnGroupHeaders: (params?: GetHeadersParams) => JSX.Element[] | null;
    isDragging: boolean;
    getRootProps: (other?: {}) => {
        style: {
            minHeight: number;
            maxHeight: number;
            lineHeight: string;
        };
    };
    getInnerProps: () => {
        ref: React.Ref<HTMLDivElement>;
        role: string;
    };
};
export {};
