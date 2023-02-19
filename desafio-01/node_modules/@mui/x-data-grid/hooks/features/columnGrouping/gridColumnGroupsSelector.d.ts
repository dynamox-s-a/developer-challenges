import { GridStateCommunity } from '../../../models/gridStateCommunity';
/**
 * @category ColumnGrouping
 * @ignore - do not document.
 */
export declare const gridColumnGroupingSelector: (state: GridStateCommunity) => import("./gridColumnGroupsInterfaces").GridColumnsGroupingState;
export declare const gridColumnGroupsLookupSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("./gridColumnGroupsInterfaces").GridColumnGroupLookup>;
