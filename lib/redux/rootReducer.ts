import { machinesSlice } from "./slices";
import { monitoringPointsSlice } from "./slices";

export const reducer = {
  machines: machinesSlice.reducer,
  monitoringPoints: monitoringPointsSlice.reducer,
};
