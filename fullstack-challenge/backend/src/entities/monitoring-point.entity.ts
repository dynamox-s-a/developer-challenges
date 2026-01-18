export type MonitoringPointType = 'TcAg' | 'TcAs' | 'HF+';

export default class MonitoringPoint {
  private constructor(
    readonly id: number,
    readonly name: string,
    readonly type: MonitoringPointType,
    readonly machineId: number,
  ) {}

  static restore(params: MonitoringPointProps) {
    return new MonitoringPoint(params.id, params.name, params.type, params.machineId);
  }
}

export type MonitoringPointProps = {
  id: number;
  name: string;
  type: MonitoringPointType;
  machineId: number;
};
