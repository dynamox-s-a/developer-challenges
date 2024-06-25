
export interface User {
  email: string;
  id: number;
  name: string;
}


export interface SessionDataType {
  accessToken: string;
  expires: string; 
  user: User;
}