import type { Database } from "@dyn/database";
import { sql } from "drizzle-orm";

import { createMachineRepository, type MachineRepository } from "./modules/machines/repository.js";
import { createMachineService } from "./modules/machines/service.js";
import {
  createMonitoringPointRepository,
  type MonitoringPointRepository,
} from "./modules/monitoring-points/repository.js";
import { createMonitoringPointService } from "./modules/monitoring-points/service.js";
import {
  createTimeSeriesRepository,
  type TimeSeriesRepository,
} from "./modules/time-series/repository.js";
import { createTimeSeriesService } from "./modules/time-series/service.js";
import { createUserRepository, type UserRepository } from "./modules/users/repository.js";

// One composed seam: production wires the Drizzle slices, tests stub the methods they need.
export type AppRepository = { health: () => Promise<void> } & MachineRepository &
  MonitoringPointRepository &
  TimeSeriesRepository &
  UserRepository;

export function createAppRepository(db: Database): AppRepository {
  return {
    async health() {
      await db.execute(sql`select 1`);
    },
    ...createMachineRepository(db),
    ...createMonitoringPointRepository(db),
    ...createTimeSeriesRepository(db),
    ...createUserRepository(db),
  };
}

export function createServices(repository: AppRepository) {
  return {
    machines: createMachineService(repository),
    monitoringPoints: createMonitoringPointService(repository),
    timeSeries: createTimeSeriesService(repository),
  };
}

export type Services = ReturnType<typeof createServices>;
