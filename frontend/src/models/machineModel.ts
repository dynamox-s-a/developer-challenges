

export interface MachineData {
  machine_id: number;
  map: any;
  user_id: number;
  machine_type: string;
  machine_name: string;
  createdAt: string;
  updatedAt: string;
  monitors: {
      monitoring_point_id: number;
      monitoring_point_name: string;
      sensors: {
          sensor_type: string;
          monitoring_point: string;
      }[];
  }[];
}

export type MachineDataArray = MachineData[];