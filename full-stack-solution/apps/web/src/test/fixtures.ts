import type {
  Machine,
  MeasurementMetric,
  MonitoringPoint,
  Reading,
  ReadingsMetrics,
} from "@full-stack-solution/shared";

/** Deterministic fixtures shared by the tests. */

export function makeMachine(overrides: Partial<Machine> = {}): Machine {
  return {
    id: "machine-1",
    name: "Pump A",
    type: "Pump",
    monitoringPointsCount: 2,
    ...overrides,
  };
}

export function makeMonitoringPoint(
  overrides: Partial<MonitoringPoint> = {},
): MonitoringPoint {
  return {
    id: "point-1",
    name: "Bearing",
    machineId: "machine-1",
    machineName: "Pump A",
    machineType: "Pump",
    sensorId: null,
    sensorModel: null,
    ...overrides,
  };
}

export function makeReadings(
  count = 3,
  metric: MeasurementMetric = "temperature",
): Reading[] {
  return Array.from({ length: count }, (_unused, index) => ({
    timestamp: new Date(Date.UTC(2026, 0, 1, 0, index)).toISOString(),
    value: index,
    metric,
  }));
}

export function makeMetrics(
  overrides: Partial<ReadingsMetrics> = {},
): ReadingsMetrics {
  return {
    metric: "temperature",
    count: 3,
    min: 0,
    max: 2,
    avg: 1,
    firstTimestamp: "2026-01-01T00:00:00.000Z",
    lastTimestamp: "2026-01-01T00:02:00.000Z",
    ...overrides,
  };
}
