import * as Api from "../api";
import { Machine } from "../entity/machine";
import RepositoryInterface from "../interface/repository";

export default class MachineRepository implements RepositoryInterface<Machine> {

  async list() {
    return Api.listMachines()
  }

  async create(machine: Machine) {
    return Api.createMachine(machine.name, machine.type)
  }

  async update(machine: Machine) {
    return Api.updateMachine(machine)
  }

  async delete(machine: Machine) {
    return Api.deleteMachine(machine)
  }
}