/**
 * The mode of the cell.
 */
export declare type GridCellMode = 'edit' | 'view';
/**
 * The mode of the row.
 */
export declare type GridRowMode = 'edit' | 'view';
/**
 * The cell value type.
 * @deprecated Use `any` or the V generic passed to most interfaces.
 */
export declare type GridCellValue = string | number | boolean | Date | null | undefined | object;
/**
 * The coordinates of cell represented by their row and column indexes.
 */
export interface GridCellIndexCoordinates {
    colIndex: number;
    rowIndex: number;
}
/**
 * The coordinates of column header represented by their row and column indexes.
 */
export interface GridColumnHeaderIndexCoordinates {
    colIndex: number;
}
