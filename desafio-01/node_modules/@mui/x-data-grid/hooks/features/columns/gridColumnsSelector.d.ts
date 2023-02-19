import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridColumnLookup } from './gridColumnsInterfaces';
/**
 * @category Columns
 * @deprecated Use the selector returning exactly the value you are looking for.
 * @ignore - do not document.
 * TODO v6: Rename `gridColumnsStateSelector`
 */
export declare const gridColumnsSelector: (state: GridStateCommunity) => import("./gridColumnsInterfaces").GridColumnsState;
/**
 * Get the field of each column.
 * @category Columns
 */
export declare const gridColumnFieldsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, string[]>;
/**
 * Get the columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Columns
 */
export declare const gridColumnLookupSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, GridColumnLookup>;
/**
 * Get the columns as an array.
 * @category Columns
 */
export declare const gridColumnDefinitionsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("../../..").GridStateColDef<any, any, any>[]>;
/**
 * Get the column visibility model, containing the visibility status of each column.
 * If a column is not registered in the model, it is visible.
 * @category Visible Columns
 */
export declare const gridColumnVisibilityModelSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("./gridColumnsInterfaces").GridColumnVisibilityModel>;
/**
 * Get the visible columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Visible Columns
 */
export declare const gridVisibleColumnDefinitionsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("../../..").GridStateColDef<any, any, any>[]>;
/**
 * Get the field of each visible column.
 * @category Visible Columns
 */
export declare const gridVisibleColumnFieldsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, string[]>;
/**
 * Get the left position in pixel of each visible columns relative to the left of the first column.
 * @category Visible Columns
 */
export declare const gridColumnPositionsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, number[]>;
/**
 * Get the summed width of all the visible columns.
 * @category Visible Columns
 */
export declare const gridColumnsTotalWidthSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, number>;
/**
 * Get the filterable columns as an array.
 * @category Columns
 */
export declare const gridFilterableColumnDefinitionsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("../../..").GridStateColDef<any, any, any>[]>;
/**
 * Get the filterable columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Columns
 */
export declare const gridFilterableColumnLookupSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, GridColumnLookup>;
/**
 * @category Columns
 * @deprecated Use `gridColumnFieldsSelector` instead.
 * @ignore - do not document.
 */
export declare const allGridColumnsFieldsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, string[]> | ((...args: any[]) => any);
/**
 * @category Columns
 * @deprecated Use `gridColumnDefinitionsSelector` instead.
 * @ignore - do not document.
 */
export declare const allGridColumnsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("../../..").GridStateColDef<any, any, any>[]> | ((...args: any[]) => any);
/**
 * @category Visible Columns
 * @deprecated Use `gridVisibleColumnDefinitionsSelector` instead.
 * @ignore - do not document.
 */
export declare const visibleGridColumnsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("../../..").GridStateColDef<any, any, any>[]> | ((...args: any[]) => any);
/**
 * @category Columns
 * @deprecated Use `gridFilterableColumnDefinitionsSelector` instead.
 * @ignore - do not document.
 */
export declare const filterableGridColumnsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("../../..").GridStateColDef<any, any, any>[]> | ((...args: any[]) => any);
/**
 * @category Columns
 * @deprecated Use `gridFilterableColumnLookupSelector` instead (not the same return format).
 * @ignore - do not document.
 */
export declare const filterableGridColumnsIdsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, string[]> | ((...args: any[]) => any);
/**
 * Get the amount of visible columns.
 * @category Visible Columns
 * @deprecated Use the length of the array returned by `gridVisibleColumnDefinitionsSelector` instead.
 * @ignore - do not document.
 */
export declare const visibleGridColumnsLengthSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, number> | ((...args: any[]) => any);
/**
 * @category Visible Columns
 * @deprecated Use `gridColumnsTotalWidthSelector` or `gridColumnPositionsSelector` instead.
 * @ignore - do not document.
 */
export declare const gridColumnsMetaSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, {
    totalWidth: number;
    positions: number[];
}> | ((...args: any[]) => any);
