import type {
  MachineDetailDto,
  MachineDto,
  MonitoringPointListItemDto,
  Paginated,
  SensorDto,
} from '@dynapredict/shared-types';

export function aMachine(overrides: Partial<MachineDto> = {}): MachineDto {
  return {
    id: 'm-1',
    name: 'Pump 01',
    type: 'Pump',
    monitoringPointsCount: 2,
    createdAt: '2026-10-01T12:00:00.000Z',
    updatedAt: '2026-10-01T12:00:00.000Z',
    ...overrides,
  };
}

export function aMachineDetail(
  overrides: Partial<MachineDetailDto> = {},
): MachineDetailDto {
  return {
    id: 'm-1',
    name: 'Pump 01',
    type: 'Pump',
    createdAt: '2026-10-01T12:00:00.000Z',
    updatedAt: '2026-10-01T12:00:00.000Z',
    monitoringPoints: [],
    ...overrides,
  };
}

export function aSensor(overrides: Partial<SensorDto> = {}): SensorDto {
  return {
    id: 's-1',
    serialNumber: 'HFP-0001',
    model: 'HF+',
    monitoringPointId: 'p-1',
    createdAt: '2026-10-01T12:00:00.000Z',
    ...overrides,
  };
}

export function aPointListItem(
  overrides: Partial<MonitoringPointListItemDto> = {},
): MonitoringPointListItemDto {
  return {
    id: 'p-1',
    name: 'Bearing DE',
    machine: { id: 'm-1', name: 'Pump 01', type: 'Pump' },
    sensor: aSensor(),
    createdAt: '2026-10-01T12:00:00.000Z',
    updatedAt: '2026-10-01T12:00:00.000Z',
    ...overrides,
  };
}

export function aPage<T>(
  data: T[],
  meta: Partial<Paginated<T>['meta']> = {},
): Paginated<T> {
  return {
    data,
    meta: { page: 1, pageSize: 10, total: data.length, totalPages: 1, ...meta },
  };
}

/** A promise the test resolves by hand, to order concurrent responses. */
export function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}
