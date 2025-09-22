/**
 * Centralized exports for utility functions
 * Import utilities from this file for better organization
 */

// Date utilities
export * from "./date";

// Validation utilities
export * from "./validation";

// Storage utilities
export * from "./storage";

// Formatting utilities
export * from "./format";

// HTTP utilities
export * from "./http";

// Re-export commonly used functions for convenience
export { formatEventDate, getCurrentDateForInput } from "./date";

export {
  isValidEmail,
  isValidPassword,
  validateEventForm,
  validateLoginForm,
  VALIDATION_MESSAGES,
} from "./validation";

export { authStorage, STORAGE_KEYS } from "./storage";

export { capitalize, truncateText, formatEventCategory } from "./format";

export { isSuccessStatus } from "./http";
