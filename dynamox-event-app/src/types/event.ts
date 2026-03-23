
export type UserRole = 'admin' | 'reader';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export type EventCategory = 'Conference' | 'Workshop' | 'Webinar' | 'Networking' | 'Other';

export interface Event {
  id: string;
  name: string;
  dateTime: string;
  location: string;
  description: string;
  category: EventCategory;
}