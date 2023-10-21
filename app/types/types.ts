export type RootState = {
  page: {
    activeComponent: string;
  };
  auth: AuthState; 
};

export type AuthState = {
  authToken: string | null; 
  userId: string | null;
};

export interface MachineType {
  id: number;
  machine_type: string;
}

export interface Machines {
  id: number;
  name: string,
  sector: string,
  machine_type_selected: string;
}

export interface AppState {
  machineTypes: string; 
  machines: string; 
  
}
