import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
/**
 * @category Filtering
 */
export declare const gridFilterStateSelector: (state: GridStateCommunity) => import("./gridFilterState").GridFilterState;
/**
 * Get the current filter model.
 * @category Filtering
 */
export declare const gridFilterModelSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("../../..").GridFilterModel>;
/**
 * Get the current quick filter values.
 * @category Filtering
 */
export declare const gridQuickFilterValuesSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, any[] | undefined>;
/**
 * @category Filtering
 * @ignore - do not document.
 */
export declare const gridVisibleRowsLookupSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, Record<import("../../..").GridRowId, boolean>>;
/**
 * @category Filtering
 * @ignore - do not document.
 */
export declare const gridFilteredRowsLookupSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, Record<import("../../..").GridRowId, boolean>>;
/**
 * @category Filtering
 * @ignore - do not document.
 */
export declare const gridFilteredDescendantCountLookupSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, Record<import("../../..").GridRowId, number>>;
/**
 * Get the id and the model of the rows accessible after the filtering process.
 * Does not contain the collapsed children.
 * @category Filtering
 */
export declare const gridVisibleSortedRowEntriesSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, {
    id: import("../../..").GridRowId;
    model: import("../../..").GridValidRowModel;
}[]>;
/**
 * Get the id of the rows accessible after the filtering process.
 * Does not contain the collapsed children.
 * @category Filtering
 */
export declare const gridVisibleSortedRowIdsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("../../..").GridRowId[]>;
/**
 * Get the id and the model of the rows accessible after the filtering process.
 * Contains the collapsed children.
 * @category Filtering
 */
export declare const gridFilteredSortedRowEntriesSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, {
    id: import("../../..").GridRowId;
    model: import("../../..").GridValidRowModel;
}[]>;
/**
 * Get the id of the rows accessible after the filtering process.
 * Contains the collapsed children.
 * @category Filtering
 */
export declare const gridFilteredSortedRowIdsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("../../..").GridRowId[]>;
/**
 * @category Filtering
 * @deprecated Use `gridVisibleSortedRowIdsSelector` instead
 * @ignore - do not document.
 * TODO: Add deprecation warning once we have the new selectors without the "visible" keyword.
 */
export declare const gridVisibleRowsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("../../..").GridRowId[]>;
/**
 * Get the id and the model of the top level rows accessible after the filtering process.
 * @category Filtering
 */
export declare const gridVisibleSortedTopLevelRowEntriesSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, {
    id: import("../../..").GridRowId;
    model: import("../../..").GridValidRowModel;
}[]>;
/**
 * Get the amount of rows accessible after the filtering process.
 * @category Filtering
 */
export declare const gridVisibleRowCountSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, number>;
/**
 * Get the amount of top level rows accessible after the filtering process.
 * @category Filtering
 */
export declare const gridVisibleTopLevelRowCountSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, number>;
/**
 * @category Filtering
 * @ignore - do not document.
 */
export declare const gridFilterActiveItemsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, GridFilterItem[]>;
export declare type GridFilterActiveItemsLookup = {
    [columnField: string]: GridFilterItem[];
};
/**
 * @category Filtering
 * @ignore - do not document.
 */
export declare const gridFilterActiveItemsLookupSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, GridFilterActiveItemsLookup>;
