export interface User {
  id: string;
  name?: string;
  email?: string;

  [key: string]: unknown;
}
