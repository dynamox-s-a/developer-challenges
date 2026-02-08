export const EVENT_CATEGORIES = [
  "Conferência",
  "Workshop",
  "Webinar",
  "Networking",
  "Outro",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const VALIDATION_RULES = {
  MIN_DESCRIPTION_LENGTH: 50,
} as const;
