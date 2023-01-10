export interface IUser {
  email: string;
  password: string;
  token?: string;
  loading?: boolean;
}

export interface FetchUserInfo {
  email: string;
  password: string;
}
