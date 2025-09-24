export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  category: string;
}

export interface EventFormData {
  name: string;
  date: string;
  location: string;
  description: string;
  category: string;
}

export type EventCategory =
  | "Workshop"
  | "Conference"
  | "Webinar"
  | "Meetup"
  | "Seminar"
  | "Training"
  | "Networking"
  | "Hackathon"
  | "Competition"
  | "Other";

export interface EventFilters {
  searchTerm: string;
  categoryFilter: string;
  locationFilter: string;
  sortBy: "date" | "name";
  sortOrder: "asc" | "desc";
}
