
export interface Machine {
  _id: string;
  name: string;
  type: "Pump" | "Fan";
}

export interface Sensor {
  model: "TcAg" | "TcAs" | "HF+";
  serialNumber: string;
}

export interface MonitoringPoint {
  _id: string;
  name: string;
  sensor: Sensor;
  machineId: Machine;
}

export interface MonitoringPointTableProps {
  data: MonitoringPoint[];
  sortBy: string;
  order: "asc" | "desc";
  onSortChange: (field: string) => void;
}

export interface MonitoringPointState {
  points: MonitoringPoint[];
  loading: boolean;
  error: string | null;
  total: number;
  sortBy: string;
  order: 'asc' | 'desc';
  page: number;
}

export interface MonitoringPointInput {
  machineId: string;
  name: string;
  sensor: {
    model: "TcAg" | "TcAs" | "HF+";
    serialNumber: string;
  };
}