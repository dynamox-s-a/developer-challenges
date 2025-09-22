/**
 * Form validation utilities
 */

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength (minimum 6 characters)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validates required field is not empty
 */
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates event name (2-100 characters)
 */
export const isValidEventName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

/**
 * Validates event location (2-200 characters)
 */
export const isValidEventLocation = (location: string): boolean => {
  return location.trim().length >= 2 && location.trim().length <= 200;
};

/**
 * Validates event description (10-1000 characters)
 */
export const isValidEventDescription = (description: string): boolean => {
  return description.trim().length >= 10 && description.trim().length <= 1000;
};

/**
 * Validates event date is in the future
 */
export const isValidEventDate = (dateString: string): boolean => {
  try {
    const eventDate = new Date(dateString);
    const now = new Date();
    return eventDate >= now;
  } catch {
    return false;
  }
};

/**
 * Validates event category is from allowed list
 */
export const isValidEventCategory = (
  category: string,
  allowedCategories: string[]
): boolean => {
  return allowedCategories.includes(category);
};

/**
 * Form validation error messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: "Este campo é obrigatório",
  INVALID_EMAIL: "Email inválido",
  INVALID_PASSWORD: "Senha deve ter pelo menos 6 caracteres",
  INVALID_EVENT_NAME: "Nome deve ter entre 2 e 100 caracteres",
  INVALID_EVENT_LOCATION: "Local deve ter entre 2 e 200 caracteres",
  INVALID_EVENT_DESCRIPTION: "Descrição deve ter entre 10 e 1000 caracteres",
  INVALID_EVENT_DATE: "Data deve ser no futuro",
  INVALID_EVENT_CATEGORY: "Categoria inválida",
} as const;

/**
 * Validates an entire event form
 */
export const validateEventForm = (
  eventData: {
    name: string;
    date: string;
    location: string;
    description: string;
    category: string;
  },
  allowedCategories: string[]
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!isRequired(eventData.name)) {
    errors.name = VALIDATION_MESSAGES.REQUIRED;
  } else if (!isValidEventName(eventData.name)) {
    errors.name = VALIDATION_MESSAGES.INVALID_EVENT_NAME;
  }

  if (!isRequired(eventData.date)) {
    errors.date = VALIDATION_MESSAGES.REQUIRED;
  } else if (!isValidEventDate(eventData.date)) {
    errors.date = VALIDATION_MESSAGES.INVALID_EVENT_DATE;
  }

  if (!isRequired(eventData.location)) {
    errors.location = VALIDATION_MESSAGES.REQUIRED;
  } else if (!isValidEventLocation(eventData.location)) {
    errors.location = VALIDATION_MESSAGES.INVALID_EVENT_LOCATION;
  }

  if (!isRequired(eventData.description)) {
    errors.description = VALIDATION_MESSAGES.REQUIRED;
  } else if (!isValidEventDescription(eventData.description)) {
    errors.description = VALIDATION_MESSAGES.INVALID_EVENT_DESCRIPTION;
  }

  if (!isRequired(eventData.category)) {
    errors.category = VALIDATION_MESSAGES.REQUIRED;
  } else if (!isValidEventCategory(eventData.category, allowedCategories)) {
    errors.category = VALIDATION_MESSAGES.INVALID_EVENT_CATEGORY;
  }

  return errors;
};

/**
 * Validates login form
 */
export const validateLoginForm = (
  email: string,
  password: string
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!isRequired(email)) {
    errors.email = VALIDATION_MESSAGES.REQUIRED;
  } else if (!isValidEmail(email)) {
    errors.email = VALIDATION_MESSAGES.INVALID_EMAIL;
  }

  if (!isRequired(password)) {
    errors.password = VALIDATION_MESSAGES.REQUIRED;
  } else if (!isValidPassword(password)) {
    errors.password = VALIDATION_MESSAGES.INVALID_PASSWORD;
  }

  return errors;
};
