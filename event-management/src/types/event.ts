export interface EventCreate {
  name: string;
  description: string;
  dateTime: string;
  location: string;
  category: string;
}

export interface Event extends EventCreate {
  id: string;
}
