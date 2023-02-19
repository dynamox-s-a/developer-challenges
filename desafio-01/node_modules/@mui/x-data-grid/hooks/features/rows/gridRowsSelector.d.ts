import { GridStateCommunity } from '../../../models/gridStateCommunity';
export declare const gridRowsStateSelector: (state: GridStateCommunity) => import("./gridRowsState").GridRowsState;
export declare const gridRowCountSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, number>;
export declare const gridRowsLoadingSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, boolean | undefined>;
export declare const gridTopLevelRowCountSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, number>;
export declare const gridRowsLookupSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("../../..").GridRowsLookup<import("../../..").GridValidRowModel>>;
export declare const gridRowsIdToIdLookupSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, Record<string, import("../../..").GridRowId>>;
export declare const gridRowTreeSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("../../..").GridRowTreeConfig>;
export declare const gridRowGroupingNameSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, string>;
export declare const gridRowTreeDepthSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, number>;
export declare const gridRowIdsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("../../..").GridRowId[]>;
/**
 * @ignore - do not document.
 */
export declare const gridAdditionalRowGroupsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, {
    pinnedRows?: import("./gridRowsState").GridPinnedRowsState | undefined;
} | undefined>;
/**
 * @ignore - do not document.
 */
export declare const gridPinnedRowsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("./gridRowsState").GridPinnedRowsState | undefined>;
/**
 * @ignore - do not document.
 */
export declare const gridPinnedRowsCountSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, number>;
