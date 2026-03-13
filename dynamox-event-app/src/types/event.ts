
export type UserRole = 'admin' | 'reader';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}