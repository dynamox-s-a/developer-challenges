export class UserDto {
  readonly id: number;
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
}

export class MachineDto {
  readonly id: number;
  readonly createdAt: Date;
  readonly name: string;
  readonly machineTypeId: number;
}

export class MachineTypeDto {
  readonly id: number;
  readonly name: string;
}

export class MonitoringPointDto {
  readonly id: number;
  readonly createdAt: Date;
  readonly name: string;
  readonly machineId: number;
  readonly sensorId: number;
}

export class SensorDto {
  readonly id: number;
  readonly name: string;
}