import { EventModel } from "@/dto/EventModelDto";
import { Box } from "@mui/material";
import { useState } from "react";
import EventCardExpandable from "./EventCardExpandable";

interface EventGridProps {
    events: EventModel[];
    faded?: boolean;
}

export function EventGrid({ events, faded = false }: EventGridProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                },
                gap: 3,
                mb: 6,
            }}
        >
            {events.map((event) => (
                <EventCardExpandable
                    key={event.id}
                    event={event}
                    expandedId={expandedId}
                    onToggle={setExpandedId}
                    faded={faded}
                />
            ))}
        </Box>
    );
}