import { GridColumnGroup } from '../../../models/gridColumnGrouping';
export declare type GridColumnGroupLookup = {
    [field: string]: Omit<GridColumnGroup, 'children'>;
};
export interface GridColumnsGroupingState {
    lookup: GridColumnGroupLookup;
}
