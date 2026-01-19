'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents } from '@/store/eventsSlice'
import { RootState, AppDispatch } from '@/store'
import LogoutButton from '@/components/global/LogoutButton'
import EventFilter from '@/components/events/EventFilter'
import EventSection from '@/components/events/EventSection'
import withAuth from '@/hocs/withAuth'
import { useEventFilter } from '@/hooks/useEventFilter'
import { Box, Stack, Typography } from '@mui/material'

function EventsPage() {
    const dispatch = useDispatch<AppDispatch>()
    const events = useSelector((state: RootState) => state.events.list)

    const [search, setSearch] = useState('')
    const [sort, setSort] = useState<'date' | 'name'>('date')

    const { upcoming, past } = useEventFilter(events, search, sort)

    useEffect(() => {
        dispatch(fetchEvents())
    }, [dispatch])

    const totalEvents = events.length

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', minHeight: '100vh' }}>
            {/* Header */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
                mb={4}
            >
                <Stack>
                    <Typography variant="h5" fontWeight={700}>
                        Eventos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Total de {totalEvents} evento{totalEvents !== 1 ? 's' : ''} cadastrado{totalEvents !== 1 ? 's' : ''}
                    </Typography>
                </Stack>

                <LogoutButton />
            </Stack>

            {/* Filtros */}
            <EventFilter
                search={search}
                sort={sort}
                onSearchChange={setSearch}
                onSortChange={setSort}
            />

            {/* Próximos eventos */}
            <Stack spacing={4}>
                <EventSection
                    title={`Próximos Eventos (${upcoming.length})`}
                    events={upcoming}
                    isPast={false}
                />

                {/* Eventos passados */}
                <EventSection
                    title={`Eventos Passados (${past.length})`}
                    events={past}
                    isPast={true}
                />
            </Stack>
        </Box>
    )
}

export default withAuth(EventsPage, 'reader')
