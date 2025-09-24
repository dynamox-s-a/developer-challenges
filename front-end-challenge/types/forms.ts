import { EventFormData } from "./events";
import { LoginFormCredentials } from "./auth";

export interface FormEventProps {
  onSubmit: (data: EventFormData) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  loading?: boolean;
  title?: string;
  initialData?: Partial<EventFormData>;
  className?: string;
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormCredentials) => void;
  loading?: boolean;
  error?: string | null;
  title?: string;
  className?: string;
}

export type { EventFormData } from "./events";
export type { LoginFormCredentials } from "./auth";
