import { EVENT_CATEGORIES } from '@/constants/event-category'

export type EventCategory = (typeof EVENT_CATEGORIES)[number]

export interface Event {
  id: number
  event_name: string
  date_time: string
  location: string
  description: string
  category: EventCategory
}
