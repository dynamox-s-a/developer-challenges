import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import MetricCard from '../global/MetricCard'
import {
    filterFutureEvents,
    filterPastEvents,
    getMostPopularCategoryCount,
} from '@/utils/eventHelpers'
import type { Event } from '@/types/Event'

interface EventStatsProps {
    events: Event[]
}

// Componente para exibir estatísticas dos eventos para
export const EventStats: React.FC<EventStatsProps> = ({ events }) => {
    const stats = useMemo(
        () => ({
            total: events.length,
            upcoming: filterFutureEvents(events).length,
            past: filterPastEvents(events).length,
            mostPopular: getMostPopularCategoryCount(events),
        }),
        [events]
    )

    return (
        <Card sx={{ mt: 5, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <CardHeader
                title="Estatísticas e Métricas"
                sx={{
                    pb: 3,
                    '& .MuiCardHeader-title': {
                        fontSize: '1.5rem',
                        fontWeight: 700,
                    },
                }}
            />

            <CardContent sx={{ pt: 0 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            value={stats.total}
                            label="Total de Eventos"
                            color="primary"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            value={stats.upcoming}
                            label="Próximos Eventos"
                            color="success"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            value={stats.past}
                            label="Eventos Passados"
                            color="warning"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            value={stats.mostPopular}
                            label="Categoria Mais Popular"
                            color="info"
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default EventStats
