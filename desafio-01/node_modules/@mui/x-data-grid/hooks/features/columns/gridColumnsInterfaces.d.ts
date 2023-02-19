import type { GridRowId } from '../../../models';
import { GridColDef, GridStateColDef } from '../../../models/colDef/gridColDef';
import type { GridColumnDimensionProperties } from './gridColumnsUtils';
export declare type GridColumnLookup = {
    [field: string]: GridStateColDef;
};
export declare type GridColumnRawLookup = {
    [field: string]: GridColDef | GridStateColDef;
};
export interface GridColumnsState {
    /**
     * TODO v6: Rename `all` to `orderedFields`
     */
    all: string[];
    lookup: GridColumnLookup;
    columnVisibilityModel: GridColumnVisibilityModel;
}
export interface GridColumnsInternalCache {
    isUsingColumnVisibilityModel: boolean;
}
export declare type GridColumnDimensions = {
    [key in GridColumnDimensionProperties]?: number;
};
export interface GridColumnsInitialState {
    columnVisibilityModel?: GridColumnVisibilityModel;
    orderedFields?: string[];
    dimensions?: Record<string, GridColumnDimensions>;
}
export declare type GridColumnsRawState = Omit<GridColumnsState, 'lookup'> & {
    lookup: GridColumnRawLookup;
};
export declare type GridHydrateColumnsValue = Omit<GridColumnsRawState, 'columnVisibilityModel'>;
export declare type GridColumnVisibilityModel = Record<GridRowId, boolean>;
