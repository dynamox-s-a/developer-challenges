import { GridRowId } from '../../../models/gridRows';
export declare type GridCellIdentifier = {
    id: GridRowId;
    field: string;
};
export declare type GridColumnIdentifier = {
    field: string;
};
export interface GridFocusState {
    cell: GridCellIdentifier | null;
    columnHeader: GridColumnIdentifier | null;
}
export interface GridTabIndexState {
    cell: GridCellIdentifier | null;
    columnHeader: GridColumnIdentifier | null;
}
