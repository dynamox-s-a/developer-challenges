export default interface ISensor extends ICreateSensorParams {
  id: string;
}

export interface ICreateSensorParams {
  machineId: string;
  name: string;
  type: string;
}
