import { useMemo } from 'react';
import { isPast } from 'date-fns';
import { Event } from '@/types/event';

type SortBy = 'date-asc' | 'date-desc' | 'name-asc' | 'name-desc';

interface Params {
  events: Event[];
  search: string;
  categoryFilter: string;
  sortBy: SortBy;
  tab: 'upcoming' | 'past';
}

export function useFilteredEvents({
  events,
  search,
  categoryFilter,
  sortBy,
  tab
}: Params) {

  const filtered = useMemo(() => {

    let result = events.filter(event => {

      const matchSearch =
        event.name.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        categoryFilter === 'all' || event.category === categoryFilter;

      return matchSearch && matchCategory;
    });

    const sorted = [...result].sort((a, b) => {

      switch (sortBy) {

        case 'date-asc':
          return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();

        case 'date-desc':
          return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();

        case 'name-asc':
          return a.name.localeCompare(b.name);

        case 'name-desc':
          return b.name.localeCompare(a.name);

        default:
          return 0;
      }
    });

    return sorted;

  }, [events, search, categoryFilter, sortBy]);

  const upcoming = useMemo(
    () => filtered.filter(e => !isPast(new Date(e.dateTime))),
    [filtered]
  );

  const past = useMemo(
    () => filtered.filter(e => isPast(new Date(e.dateTime))),
    [filtered]
  );

  const list = tab === 'upcoming' ? upcoming : past;

  return {
    filtered,
    upcoming,
    past,
    list
  };
}