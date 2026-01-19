import React from 'react'
import {
    Card,
    CardContent,
    Typography,
    Stack,
    Chip,
} from '@mui/material'
import { formatDate, getCategoryColor } from '@/utils/eventHelpers'
import CalendarMonth from '@mui/icons-material/CalendarMonth'
import LocationOn from '@mui/icons-material/LocationOn'
import type { Event } from '@/types/Event'

interface EventCardProps {
    event: Event
    isPast?: boolean
}

// Componente para exibir um card individual de evento
export const EventCard: React.FC<EventCardProps> = ({ event, isPast = false }) => {

    return (
        <Card
            variant={'outlined'} sx={{
                borderRadius: 2,
            }}
        >
            <CardContent>
                <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Typography variant="h6" fontWeight={600} noWrap>
                            {event.name}
                        </Typography>
                        <Chip
                            label={event.category}
                            size="small"
                            color={getCategoryColor(event.category)}
                            variant="outlined"
                        />

                    </Stack>

                    <Typography variant="caption" display={'flex'} alignItems={'center'} color="text.secondary">
                        <CalendarMonth sx={{ fontSize: 15, marginRight: 0.5 }} />
                        {formatDate(event.date)}
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {event.description}
                    </Typography>

                    <Stack direction="row" spacing={1} justifyContent="space-between" >
                        <Typography variant="caption" color="text.secondary" display={'flex'} alignItems={'center'} fontWeight={500}>
                            <LocationOn sx={{ fontSize: 15, marginRight: 0.5 }} />
                            {event.location}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default EventCard
