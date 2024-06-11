export default class Sensor {
  private id: string;
  private name: string;
  private type: string;
  private machineId: string;

  constructor(
    id: string,
    name: string,
    type: string,
    machineId: string,
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.machineId = machineId;
  }

  public setId(id: string) {
    this.id = id;
  }

  public getId() {
    return this.id;
  }

  public setName(name: string) {
    this.name = name;
  }

  public getName() {
    return this.name;
  }

  public setType(type: string) {
    this.type = type;
  }

  public getType() {
    return this.type;
  }
  
  public setMachineId(machineId: string) {
    this.machineId = machineId;
  }

  public getMachineId() {
    return this.machineId;
  }
  
}
