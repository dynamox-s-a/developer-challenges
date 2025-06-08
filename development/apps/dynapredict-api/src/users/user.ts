export interface SignupResponse {
  id: number;
  email: string;
  name: string;
  error?: Error;
}

export interface GetUserResponse {
  id: number;
  email: string;
  name: string;
}