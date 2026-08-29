import type { CreateMachineRequest, Machine, UpdateMachineRequest } from "@dyn/contracts";
import type { MachineRow } from "@dyn/database";

import { NotFoundError, SensorIncompatibleError } from "../../shared/errors.js";
import { incompatibleSensorModels, pumpSensorModel } from "../../shared/sensor-compatibility.js";
import type { MachineRepository } from "./repository.js";

function toMachine(row: MachineRow): Machine {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function createMachineService(repository: MachineRepository) {
  return {
    async list() {
      const machines = await repository.listMachines();
      return { items: machines.map(toMachine) };
    },

    async get(id: string) {
      const machine = await repository.findMachine(id);
      if (!machine) {
        throw new NotFoundError("Machine");
      }
      return toMachine(machine);
    },

    async create(input: CreateMachineRequest) {
      const machine = await repository.createMachine(input);
      return toMachine(machine);
    },

    async update(id: string, input: UpdateMachineRequest) {
      const outcome = await repository.updateMachine(id, {
        ...(input.name === undefined ? {} : { name: input.name }),
        ...(input.type === undefined
          ? {}
          : { type: input.type, rejectedSensorModels: incompatibleSensorModels(input.type) }),
      });

      if (outcome.status === "not-found") {
        throw new NotFoundError("Machine");
      }

      if (outcome.status === "rejected") {
        const models = [...outcome.models].sort().join(", ");
        throw new SensorIncompatibleError(
          `Machine type cannot change to ${input.type} because Pump machines only support ${pumpSensorModel} sensors, and this machine has ${models} sensors attached`,
          [
            {
              path: "type",
              message: `Detach the ${models} sensors before changing the type to ${input.type}.`,
            },
          ]
        );
      }

      return toMachine(outcome.machine);
    },

    async delete(id: string) {
      const deleted = await repository.deleteMachine(id);
      if (!deleted) {
        throw new NotFoundError("Machine");
      }
    },
  };
}

export type MachineService = ReturnType<typeof createMachineService>;
