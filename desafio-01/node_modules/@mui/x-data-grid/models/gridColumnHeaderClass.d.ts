import { GridColumnHeaderParams } from './params/gridColumnHeaderParams';
/**
 * A function used to process headerClassName params.
 */
export declare type GridColumnHeaderClassFn = (params: GridColumnHeaderParams) => string;
/**
 * The union type representing the [[GridColDef]] column header class type.
 */
export declare type GridColumnHeaderClassNamePropType = string | GridColumnHeaderClassFn;
