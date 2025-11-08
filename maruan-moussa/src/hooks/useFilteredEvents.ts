import { EventModel } from "@/dto/EventModelDto";
import { useMemo } from "react";

type SortOrder = "asc" | "desc";
type sortBy = "title" | "date";
interface UseFilteredEventsProps {
  events?: EventModel[];
  filter: string;
  sortOrder?: SortOrder;
  sortBy?: sortBy;
}

export const useFilteredEvents = ({
  events,
  filter,
  sortOrder,
}: UseFilteredEventsProps) => {
  const filteredEvents = useMemo(() => {
    if (!events) return [];

    let filtered = events.filter(
      (e) =>
        e.title.toLowerCase().includes(filter.toLowerCase()) ||
        e.location.toLowerCase().includes(filter.toLowerCase()) ||
        e.category.toLowerCase().includes(filter.toLowerCase())
    );

    if (sortOrder) {
      filtered = filtered.sort((a, b) =>
        sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      );
    }

    return filtered;
  }, [events, filter, sortOrder]);

  return filteredEvents;
};
