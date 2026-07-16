import { getMachineRoute, listMachinesRoute } from './modules/machines/presentation/machine-routes';
import { listMeasurementsRoute } from './modules/measurements/presentation/measurement-routes';

export const router = {
  machines: { list: listMachinesRoute, get: getMachineRoute },
  measurements: { list: listMeasurementsRoute },
};
