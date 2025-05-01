export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
}

export interface EventsState {
  data: Event[];
  loading: boolean;
  error: string | null;
}

export interface EventFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'title';
  order?: 'asc' | 'desc';
}

export interface EventsService {
  getEvents(filters?: EventFilters): Promise<EventsState>;
}
