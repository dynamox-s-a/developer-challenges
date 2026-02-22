export type EventCategory = 'Conference' | 'Workshop' | 'Webinar' | 'Networking' | 'Other';

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  category: EventCategory;
}