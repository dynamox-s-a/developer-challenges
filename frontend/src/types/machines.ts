// Domain Models
/** Machine type representing a piece of equipment. */
export interface Machine {
  id?: string;
  name: string;
  type: "Pump" | "Fan";
  monitoringPoints?: MonitoringPoint[];
}

/** Sensor type representing a monitoring sensor. */
export interface Sensor {
  id: string;
  name: "TcAg" | "TcAs" | "HF+";
}

/** Monitoring point type for tracking machine performance. */
export interface MonitoringPoint {
  id?: string;
  name: string;
  sensorId: string;
  sensorModel: string;
}

// Component State Types
/** State for filtering and searching machines */
export interface FilterState {
  searchQuery: string;
  selectedType: "Pump" | "Fan" | "";
}

/** State for managing machine-related modals */
export interface ModalState {
  isUpdateOpen: boolean;
  isDeleteOpen: boolean;
  selectedMachine: Machine | null;
}

// Utility Types
/** State for managing notification display */
export interface NotificationState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}
