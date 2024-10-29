import { combineReducers } from 'redux';
import MonitoringPointReducer from './reducers/monitoring-points.reducer';
import MachinesReducer from './reducers/machines.reducers';
import SensorsReducer from './reducers/sensors.reducer';

const rootReducer = combineReducers({
  monitoringPointReducer: MonitoringPointReducer,
  machinesReducer: MachinesReducer,
  sensorsReducer: SensorsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
