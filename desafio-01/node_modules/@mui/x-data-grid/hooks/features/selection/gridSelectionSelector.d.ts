import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridRowId } from '../../../models/gridRows';
export declare const gridSelectionStateSelector: (state: GridStateCommunity) => import("../../..").GridSelectionModel;
export declare const selectedGridRowsCountSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, number>;
export declare const selectedGridRowsSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, Map<GridRowId, import("../../../models/gridRows").GridValidRowModel>>;
export declare const selectedIdsLookupSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, Record<GridRowId, GridRowId>>;
