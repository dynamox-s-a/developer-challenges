import { Event, EventCategory } from '@/types/Event'

export const EVENT_CATEGORIES: Record<EventCategory, EventCategory> = {
    'Conferência': 'Conferência',
    'Workshop': 'Workshop',
    'Seminário': 'Seminário',
    'Networking': 'Networking',
    'Outro': 'Outro',
}

export const CATEGORY_COLORS: Record<EventCategory, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    'Conferência': 'primary',
    'Workshop': 'secondary',
    'Seminário': 'info',
    'Networking': 'warning',
    'Outro': 'default',
}

// Formata uma data em string para o padrão português (pt-BR) 
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('pt-BR')
}

// Obtém a cor de chip para uma categoria 
export const getCategoryColor = (category: EventCategory) => {
    return CATEGORY_COLORS[category] || 'default'
}

// Verifica se um evento é futuro 
export const isFutureEvent = (event: Event): boolean => {
    return new Date(event.date) > new Date()
}

// Filtra eventos futuros 
export const filterFutureEvents = (events: Event[]): Event[] => {
    return events.filter(isFutureEvent)
}

// Filtra eventos passados 
export const filterPastEvents = (events: Event[]): Event[] => {
    return events.filter(event => !isFutureEvent(event))
}

// Calcula a categoria mais popular 
export const getMostPopularCategoryCount = (events: Event[]): number => {
    if (events.length === 0) return 0

    const categoryCounts = events.reduce(
        (acc, event) => ({
            ...acc,
            [event.category]: (acc[event.category] || 0) + 1,
        }),
        {} as Record<EventCategory, number>
    )

    return Math.max(...Object.values(categoryCounts), 0)
}
