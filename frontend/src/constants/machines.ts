export const MACHINE_TYPES = {
  PUMP: "Pump",
  FAN: "Fan",
} as const;

export const NOTIFICATION_MESSAGES = {
  CREATE_SUCCESS: "Machine successfully created",
  UPDATE_SUCCESS: "Machine successfully updated",
  DELETE_SUCCESS: "Machine successfully deleted",
  OPERATION_ERROR: "An error occurred during the operation",
  DELETE_MP_SUCCESS: "Monitoring point has been deleted successfully",
  DELETE_ERROR: "Failed to delete monitoring point. Please try again",
  NO_POINTS: "No monitoring points have been created yet",
  NO_RESULTS: "No monitoring points match your search criteria",
  FETCH_ERROR: "Failed to fetch machines",
  NO_MACHINES: "No machines match your search criteria",
  LOADING: "Loading machines...",
} as const;

export const NOTIFICATION_DURATION = 3000;