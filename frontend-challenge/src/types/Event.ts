export type EventCategory =
    | 'Conferência'
    | 'Workshop'
    | 'Seminário'
    | 'Networking'
    | 'Outro'

export interface Event {
    id: number
    name: string
    date: string
    location: string
    description: string
    category: EventCategory
}
