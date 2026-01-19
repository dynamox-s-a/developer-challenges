import React from 'react'
import { Stack, Typography } from '@mui/material'
import EventCard from './EventCard'
import type { Event } from '@/types/Event'

interface EventSectionProps {
    title: string
    events: Event[]
    isPast?: boolean
}

// Componente para exibir uma seção de eventos (próximos ou passados)
export const EventSection: React.FC<EventSectionProps> = ({
    title,
    events,
    isPast = false,
}) => {
    return (
        <Stack spacing={2}>
            <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                    pb: 1,
                    borderBottom: '2px solid',
                    borderColor: isPast ? 'divider' : 'primary.main',
                    display: 'inline-block',
                }}
            >
                {title}
            </Typography>

            {events.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 2 }}>
                    Nenhum evento encontrado.
                </Typography>
            ) : (
                <Stack spacing={2}>
                    {events.map(event => (
                        <EventCard key={event.id} event={event} isPast={isPast} />
                    ))}
                </Stack>
            )}
        </Stack>
    )
}

export default EventSection
