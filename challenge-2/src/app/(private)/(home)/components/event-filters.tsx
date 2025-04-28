import { Box, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { setSearchTerm } from '@/store/actions/event-actions'
import { useAppDispatch, useAppSelector } from '@/store/store'

export function EventFilters() {
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const { searchTerm } = useAppSelector((state) => state.events.filters)
  const router = useRouter()
  const pathname = usePathname()

  // Sincroniza com os searchParams
  useEffect(() => {
    const search = searchParams.get('search')
    if (search) {
      dispatch(setSearchTerm(search))
    }
  }, [searchParams, dispatch])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    dispatch(setSearchTerm(value))

    // Atualiza a URL
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        label="Buscar eventos"
        value={searchTerm}
        onChange={handleSearchChange}
        size="small"
        sx={{ width: '220px' }}
      />

      <FormControl size="small" sx={{ width: '130px' }}>
        <InputLabel>Período</InputLabel>
        <Select
          // value={filters.timeFilter}
          // onChange={(e) => dispatch(setTimeFilter(e.target.value as 'all' | 'past' | 'upcoming'))}
          label="Período"
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="past">Passados</MenuItem>
          <MenuItem value="upcoming">Futuros</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ width: '130px' }}>
        <InputLabel>Ordenar por</InputLabel>
        <Select
          // value={`${filters.sortBy}-${filters.sortOrder}`}
          // onChange={(e) => {
          //   const [by, order] = e.target.value.split('-')
          //   dispatch(setSort({ by, order }))
          // }}
          label="Ordenar por"
        >
          <MenuItem value="date-desc">Data (mais recente)</MenuItem>
          <MenuItem value="date-asc">Data (mais antiga)</MenuItem>
          <MenuItem value="name-asc">Nome (A-Z)</MenuItem>
          <MenuItem value="name-desc">Nome (Z-A)</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
