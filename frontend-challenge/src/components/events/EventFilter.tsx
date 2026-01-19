import React, { useCallback } from 'react'
import { Card, CardContent, Stack, TextField, Button, Typography } from '@mui/material'

interface EventFilterProps {
    search: string
    sort: 'date' | 'name'
    onSearchChange: (value: string) => void
    onSortChange: (value: 'date' | 'name') => void
}

// Componente para filtrar e ordenar eventos
export const EventFilter: React.FC<EventFilterProps> = ({
    search,
    sort,
    onSearchChange,
    onSortChange,
}) => {
    const handleSortToggle = useCallback(
        (newSort: 'date' | 'name') => {
            onSortChange(newSort)
        },
        [onSortChange]
    )

    return (
        <Card sx={{ mb: 4, backgroundColor: '#f5f5f5' }}>
            <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                    <TextField
                        fullWidth
                        label="Buscar eventos"
                        placeholder="Digite o nome do evento"
                        value={search}
                        onChange={e => onSearchChange(e.target.value)}
                        variant="outlined"
                        size="small"
                    />

                    <Stack direction="row" spacing={1} display={'flex'} alignItems={'center'}>

                        <Typography variant="body2" fontWeight={400} paddingRight={1}>
                            Classificar por:
                        </Typography>

                        <Button
                            variant={sort === 'date' ? 'contained' : 'outlined'}
                            onClick={() => handleSortToggle('date')}
                            size="small"
                        >
                            Data
                        </Button>

                        <Button
                            variant={sort === 'name' ? 'contained' : 'outlined'}
                            onClick={() => handleSortToggle('name')}
                            size="small"
                        >
                            Nome
                        </Button>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default EventFilter
