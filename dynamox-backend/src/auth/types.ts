export interface JwtPayload {
  email: string;
  sub: string;
}

export interface UserPayload {
  userId: string;
  email: string;
}
