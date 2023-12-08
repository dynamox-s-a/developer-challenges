export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface IUserState {
  readonly user: IUser | undefined;
  readonly isLogged: boolean;
  readonly loading: boolean;
  readonly error: boolean;
}
