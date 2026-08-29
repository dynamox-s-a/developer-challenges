import type { MachineType, SensorModel } from "@dyn/contracts";
import { type Database, type MachineRow, machines, monitoringPoints, sensors } from "@dyn/database";
import { and, asc, eq, inArray } from "drizzle-orm";

import { expectCreated } from "../../shared/db.js";

export interface MachineUpdateInput {
  name?: string;
  type?: MachineType;
  rejectedSensorModels?: readonly SensorModel[];
}

export type MachineUpdateOutcome =
  | { status: "updated"; machine: MachineRow }
  | { status: "not-found" }
  | { status: "rejected"; models: SensorModel[] };

export interface MachineRepository {
  listMachines: () => Promise<MachineRow[]>;
  findMachine: (id: string) => Promise<MachineRow | null>;
  createMachine: (input: { name: string; type: MachineType }) => Promise<MachineRow>;
  updateMachine: (id: string, input: MachineUpdateInput) => Promise<MachineUpdateOutcome>;
  deleteMachine: (id: string) => Promise<boolean>;
}

export function createMachineRepository(db: Database): MachineRepository {
  return {
    listMachines() {
      return db.select().from(machines).orderBy(asc(machines.name), asc(machines.id));
    },

    async findMachine(id) {
      const [machine] = await db.select().from(machines).where(eq(machines.id, id)).limit(1);
      return machine ?? null;
    },

    async createMachine(input) {
      const rows = await db.insert(machines).values(input).returning();
      return expectCreated(rows, "machine");
    },

    async updateMachine(id, input) {
      return db.transaction(async (transaction) => {
        const [existing] = await transaction
          .select({ id: machines.id })
          .from(machines)
          .where(eq(machines.id, id))
          .for("update")
          .limit(1);

        if (!existing) {
          return { status: "not-found" };
        }

        const rejectedModels = input.rejectedSensorModels ?? [];
        if (rejectedModels.length > 0) {
          const attached = await transaction
            .selectDistinct({ model: sensors.model })
            .from(sensors)
            .innerJoin(monitoringPoints, eq(sensors.monitoringPointId, monitoringPoints.id))
            .where(
              and(eq(monitoringPoints.machineId, id), inArray(sensors.model, [...rejectedModels]))
            );

          if (attached.length > 0) {
            return { status: "rejected", models: attached.map((row) => row.model) };
          }
        }

        const [machine] = await transaction
          .update(machines)
          .set({
            ...(input.name === undefined ? {} : { name: input.name }),
            ...(input.type === undefined ? {} : { type: input.type }),
            updatedAt: new Date(),
          })
          .where(eq(machines.id, id))
          .returning();

        return machine ? { status: "updated", machine } : { status: "not-found" };
      });
    },

    async deleteMachine(id) {
      const deleted = await db
        .delete(machines)
        .where(eq(machines.id, id))
        .returning({ id: machines.id });
      return deleted.length > 0;
    },
  };
}
