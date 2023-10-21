export type RootState = {
  page: {
    activeComponent: string;
  };
  auth: AuthState; 
};

export type AuthState = {
  authToken: string | null; 
};