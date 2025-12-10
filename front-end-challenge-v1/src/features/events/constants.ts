import type { EventCategory } from "@/types";

export const EVENT_CATEGORIES: EventCategory[] = [
  "Conference",
  "Workshop",
  "Webinar",
  "Networking",
  "Other",
];

export const CATEGORY_COLORS: Record<
  EventCategory,
  "primary" | "secondary" | "success" | "warning" | "info"
> = {
  Conference: "primary",
  Workshop: "success",
  Webinar: "info",
  Networking: "secondary",
  Other: "warning",
};
