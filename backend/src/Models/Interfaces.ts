export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string | undefined;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  user_id:string;
}

export interface Sensor {
  id: string;
  name: string;
  model: string;
  machine_id: string;
}
