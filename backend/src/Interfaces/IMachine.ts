export default interface IMachine extends ICreateMachineParams {
  id: string;
}

export interface ICreateMachineParams {
  userId: string;
  name: string;
  type: string;
}