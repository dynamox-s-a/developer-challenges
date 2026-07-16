import type { Machine } from '@repo/contracts';

import { makeGetMachine, makeListMachines } from './modules/machines/application/list-machines';
import { makeJsonMachineRepository } from './modules/machines/infrastructure/json-machine-repository';
import { makeGetMachineMeasurements } from './modules/measurements/application/get-machine-measurements';
import { makeJsonMeasurementRepository } from './modules/measurements/infrastructure/json-measurement-repository';

import machinesMock from './mock/machines.json' with { type: 'json' };
import seriesMock from './mock/accelerationRms.json' with { type: 'json' };

const machineRepository = makeJsonMachineRepository(machinesMock as Machine[]);
const measurementRepository = makeJsonMeasurementRepository(seriesMock);

export const listMachines = makeListMachines(machineRepository);
export const getMachine = makeGetMachine(machineRepository);
export const getMachineMeasurements = makeGetMachineMeasurements(measurementRepository, machineRepository);
