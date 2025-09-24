import { ReactNode } from "react";

export interface ProvidersProps {
  children: ReactNode;
}

export interface ThemeProviderWrapperProps {
  children: ReactNode;
}

export interface LoadingProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "inherit";
}

export type AlertSeverity = "error" | "warning" | "info" | "success";

export type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";
