export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;

  [key: string]: unknown;
}
