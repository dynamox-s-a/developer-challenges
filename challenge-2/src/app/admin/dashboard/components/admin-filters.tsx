import { useAppDispatch, useAppSelector } from '@/store/store'

import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Stack,
} from '@mui/material'
import { resetFilters, setSearchTerm, setSort, setTimeFilter } from '@/store/actions/event-actions'

export function AdminFilters() {
  const dispatch = useAppDispatch()
  const { filters } = useAppSelector((state) => state.events)

  return (
    <Box sx={{ display: 'flex', borderRadius: 2 }}>
      <Stack direction="row" sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {/* Campo de busca */}
        <TextField
          label="Buscar eventos"
          variant="outlined"
          size="small"
          value={filters.searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          sx={{ minWidth: 150 }}
        />

        {/* Filtro de tempo */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Período</InputLabel>
          <Select
            value={filters.timeFilter}
            onChange={(e) => dispatch(setTimeFilter(e.target.value as 'all' | 'past' | 'upcoming'))}
            label="Período"
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="past">Passados</MenuItem>
            <MenuItem value="upcoming">Futuros</MenuItem>
          </Select>
        </FormControl>

        {/* Ordenação */}
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-') as ['date' | 'name', 'asc' | 'desc']
              dispatch(setSort({ by, order }))
            }}
            label="Ordenar por"
          >
            <MenuItem value="date-desc">Data (mais recente)</MenuItem>
            <MenuItem value="date-asc">Data (mais antiga)</MenuItem>
            <MenuItem value="name-asc">Nome (A-Z)</MenuItem>
            <MenuItem value="name-desc">Nome (Z-A)</MenuItem>
          </Select>
        </FormControl>

        {/* Botão para limpar filtros */}
        <Button variant="outlined" onClick={() => dispatch(resetFilters())} sx={{ height: 40 }}>
          Limpar Filtros
        </Button>
      </Stack>
    </Box>
  )
}
