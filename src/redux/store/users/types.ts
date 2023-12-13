import { FetchStatus } from "../../types";

export interface IUser {
  id: number;
  email: string;
  password: string;
}

export interface IUserState {
  readonly user: IUser | undefined;
  readonly isLogged: boolean;
  readonly status: FetchStatus;
  readonly error: string | undefined;
}

export type IUserLogin = Omit<IUser, "id">;
