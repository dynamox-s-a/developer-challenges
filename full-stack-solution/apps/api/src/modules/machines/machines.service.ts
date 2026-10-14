import {
  getBlockedSensorModels,
  type CreateMachineInput,
  type Machine,
  type UpdateMachineInput,
} from "@full-stack-solution/shared";
import { ConflictError, NotFoundError } from "../../shared/errors/app-error";
import type { MachinesRepository } from "./machines.repository";

export class MachinesService {
  constructor(private readonly repository: MachinesRepository) {}

  list(userId: string): Promise<Machine[]> {
    return this.repository.findAllByUser(userId);
  }

  create(userId: string, input: CreateMachineInput): Promise<Machine> {
    return this.repository.create(userId, input);
  }

  async update(
    id: string,
    userId: string,
    input: UpdateMachineInput,
  ): Promise<Machine> {
    const machine = await this.repository.findOwned(id, userId);
    if (!machine) {
      throw new NotFoundError("Machine");
    }

    const becomesPump = input.type === "Pump" && machine.type !== "Pump";
    if (becomesPump && (await this.repository.hasSensorsBlockedForPump(id))) {
      const blocked = getBlockedSensorModels("Pump").join(" and ");
      throw new ConflictError(
        `Cannot change the type to Pump: ${blocked} sensors cannot be used on Pump machines and this machine has some installed`,
      );
    }

    return this.repository.update(id, input);
  }

  async remove(id: string, userId: string): Promise<void> {
    const deleted = await this.repository.delete(id, userId);
    if (!deleted) {
      throw new NotFoundError("Machine");
    }
  }
}
