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

export interface MachinesType {
  id: number;
  name: string,
  sector: string,
  machine_type_selected: string;
}

export interface SensorsType {
  id: number;
  sensor_type: string,
}

export interface AppState {
  machineTypes: MachineType[];
  machines: MachinesType[];
  sensors: SensorsType[];
}

export interface Control {
  machine_name: string;
  machine_sector: string;
  machine_type_selected: string;
  controls: {
    [key: string]: string | null;
  }[];
}

export interface DashboardProps {
  controls: Control[];
}


export interface ControlData {
  id: number;
  machine_name: string;
  machine_type_selected: string;
  machine_sector: string;
  controls: {
    sensor_name: any;
    sensor_type: any;
    monitoring_point_0?: string;
    monitoring_point_1?: string;
  }[];
}
