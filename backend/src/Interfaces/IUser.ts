export default interface IUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
}

export interface ICreateUserParams {
  name: string;
  email: string;
  password: string;
}

