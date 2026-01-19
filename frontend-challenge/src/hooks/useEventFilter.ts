import { useMemo } from 'react'
import type { Event } from '@/types/Event'

interface UseEventFilterResult {
    upcoming: Event[]
    past: Event[]
}

// Hook para filtrar e ordenar eventos
export const useEventFilter = (
    events: Event[],
    search: string,
    sort: 'date' | 'name'
): UseEventFilterResult => {
    const now = useMemo(() => new Date(), [])

    const filtered = useMemo(() => {
        return events
            .filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => {
                if (sort === 'date') {
                    return new Date(a.date).getTime() - new Date(b.date).getTime()
                }
                return a.name.localeCompare(b.name)
            })
    }, [events, search, sort])

    const upcoming = useMemo(() => {
        return filtered.filter(e => new Date(e.date) > now)
    }, [filtered, now])

    const past = useMemo(() => {
        return filtered.filter(e => new Date(e.date) <= now)
    }, [filtered, now])

    return { upcoming, past }
}
