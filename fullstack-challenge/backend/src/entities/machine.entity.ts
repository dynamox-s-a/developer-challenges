export type MachineType = 'Fan' | 'Pump';

export default class Machine {
  private constructor(
    readonly id: number,
    readonly name: string,
    readonly type: MachineType,
  ) {}

  static restore(params: MachineProps) {
    return new Machine(params.id, params.name, params.type);
  }
}

export type MachineProps = {
  id: number;
  name: string;
  type: MachineType;
};
