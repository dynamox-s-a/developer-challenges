export type EventCategory = 'Conference' | 'Workshop' | 'Webinar' | 'Networking' | 'Other';

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  category: EventCategory;
}