/**
 * Central export file for all types
 *
 * Import from here instead of individual files:
 * import { User, Event, LoginCredentials, UserRole } from '@/types';
 */

// Auth enums and constants
export { UserRole, USER_ROLES } from "./auth";

// Auth types
export type {
  User,
  AuthUser,
  LoginCredentials,
  LoginFormCredentials,
  LoginResponse,
  JWTPayload,
  UserRoleType,
} from "./auth";

// Event types
export type {
  Event,
  EventFormData,
  EventCategory,
  EventFilters,
} from "./events";

// Form types
export type { FormEventProps, LoginFormProps } from "./forms";

// UI types
export type {
  ProvidersProps,
  ThemeProviderWrapperProps,
  LoadingProps,
  AlertSeverity,
  ChipColor,
} from "./ui";
