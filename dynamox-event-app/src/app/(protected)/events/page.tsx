'use client';

import { useState } from 'react';
import { EventCard } from '@/components/EventCard';
import { useGetEventsQuery } from '@/services/eventsApi';
import { useFilteredEvents } from '@/hooks/useFilteredEvents';

import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Grid,
  Stack,
  InputAdornment
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { EventCategory } from '@/types/event';

type SortBy = 'date-asc' | 'date-desc' | 'name-asc' | 'name-desc';

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortBy>('date-asc');
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  
  const { data: events = [], isLoading } = useGetEventsQuery();
  const { upcoming, past, list } = useFilteredEvents({events, search, categoryFilter, sortBy, tab})
  
  const categories: EventCategory[] = [
    'Conference',
    'Workshop',
    'Webinar',
    'Networking',
    'Other'
  ];

  if (isLoading) {
    return <Typography>Carregando eventos...</Typography>;
  }

  return (
    <Box>

      <Box mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Eventos
        </Typography>
        <Typography color="text.secondary">
          Descubra e explore novos eventos
        </Typography>
      </Box>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        mb={3}
      >

        <TextField
          fullWidth
          placeholder="Buscar eventos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }
          }}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Categoria</InputLabel>
          <Select
            value={categoryFilter}
            label="Categoria"
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="all">Todas categorias</MenuItem>

            {categories.map(c => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select
            value={sortBy}
            label="Ordenar por"
            onChange={e => setSortBy(e.target.value as SortBy)}
          >
            <MenuItem value="date-asc">Data (Mais próximos)</MenuItem>
            <MenuItem value="date-desc">Data (Mais distantes)</MenuItem>
            <MenuItem value="name-asc">Nome (A-Z)</MenuItem>
            <MenuItem value="name-desc">Nome (Z-A)</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
      >
        <Tab
          label={`Próximos (${upcoming.length})`}
          value="upcoming"
        />
        <Tab
          label={`Passados (${past.length})`}
          value="past"
        />
      </Tabs>

      <Box mt={3}>
        {list.length > 0 ? (
          <Grid container spacing={2}>
            {list.map(event => (
              <Grid
                key={event.id}
                size={{ xs: 12, md: 6, lg: 4 }}
              >
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            textAlign="center"
            py={10}
          >
            <CalendarMonthIcon
              sx={{ fontSize: 48, opacity: 0.4, mb: 2 }}
            />
            <Typography color="text.secondary">
              {tab === 'upcoming'
                ? 'Nenhum evento futuro encontrado'
                : 'Nenhum evento passado encontrado'}
            </Typography>
          </Box>
        )}
      </Box>

    </Box>
  );
}