import { machines } from './modules/machines/route';
import { measurements } from './modules/measurements/route';

export const contracts = { machines, measurements };

export * from './modules/machines/schema';
export * from './modules/measurements/schema';
