import { combineReducers } from "redux";
import Theme from "./slices/Theme";
import MachinesSlice from "./slices/MachinesSlice";
import MonitoringPointsSlice from "./slices/MonitoringPointsSlice";

const rootReducer = combineReducers({
  theme: Theme,
  machinesSlice: MachinesSlice,
  monitorinPointsSlice: MonitoringPointsSlice,
});

export { rootReducer };
