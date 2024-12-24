/**
 * Defines the types of machines used in the application.
 * @property {string} PUMP - Represents a pump machine type.
 * @property {string} FAN - Represents a fan machine type.
 */
export const MACHINE_TYPES = {
  PUMP: "Pump",
  FAN: "Fan",
} as const;

/**
 * Contains the notification messages used throughout the application.
 * @property {string} CREATE_SUCCESS - Success message when a machine is created.
 * @property {string} UPDATE_SUCCESS - Success message when a machine is updated.
 * @property {string} DELETE_SUCCESS - Success message when a machine is deleted.
 * @property {string} OPERATION_ERROR - General error message for operations.
 * @property {string} DELETE_MP_SUCCESS - Success message when a monitoring point is deleted.
 * @property {string} DELETE_ERROR - Error message when deleting a monitoring point fails.
 * @property {string} NO_POINTS - Message shown when there are no monitoring points.
 * @property {string} NO_RESULTS - Message shown when no results match the search criteria.
 * @property {string} FETCH_ERROR - Error message when fetching machines fails.
 * @property {string} NO_MACHINES - Message shown when there are no machines matching search criteria.
 * @property {string} LOADING - Message shown while machines are being loaded.
 */
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