import { GridStateCommunity } from '../../../models/gridStateCommunity';
export declare const gridDensitySelector: (state: GridStateCommunity) => import("./densityState").GridDensityState;
export declare const gridDensityValueSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("../../..").GridDensity>;
export declare const gridDensityRowHeightSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, number>;
export declare const gridDensityHeaderHeightSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, number>;
export declare const gridDensityHeaderGroupingMaxDepthSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, number>;
export declare const gridDensityFactorSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, number>;
export declare const gridDensityTotalHeaderHeightSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, number>;
