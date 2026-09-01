import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';

import { MACHINE_TYPES, SENSOR_MODELS, type MachineType, type SensorModel } from '@dynamox/domain';

import {
  filtersChanged,
  filtersCleared,
  selectHasActiveFilters,
  selectMonitoringPoints,
} from '../features/monitoringPoints/monitoringPointsSlice';
import { useAppDispatch, useAppSelector } from '../store';

/** Espera de digitação antes de consultar o servidor. */
const SEARCH_DEBOUNCE_MS = 350;

/**
 * Recorte da listagem. Nenhum filtro age sobre a página já carregada: cada mudança vira
 * uma consulta nova ao servidor, que devolve total e páginas do recorte.
 */
export function MonitoringPointFilters(): JSX.Element {
  const dispatch = useAppDispatch();
  const { filters, listStatus } = useAppSelector(selectMonitoringPoints);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);
  const [searchDraft, setSearchDraft] = useState(filters.search ?? '');

  // O campo é controlado localmente para não disparar uma requisição por tecla; quando
  // o filtro é limpo por fora, o rascunho acompanha.
  useEffect(() => {
    setSearchDraft(filters.search ?? '');
  }, [filters.search]);

  useEffect(() => {
    const trimmed = searchDraft.trim();
    const next = trimmed.length > 0 ? trimmed : null;
    if (next === filters.search) return;
    const timer = setTimeout(() => {
      dispatch(filtersChanged({ search: next }));
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [dispatch, searchDraft, filters.search]);

  const busy = listStatus === 'loading';

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      alignItems={{ md: 'center' }}
      sx={{ mb: 2 }}
    >
      <TextField
        label="Buscar"
        placeholder="Máquina, ponto ou série do sensor"
        value={searchDraft}
        onChange={(event) => setSearchDraft(event.target.value)}
        size="small"
        fullWidth
        inputProps={{ 'aria-label': 'Buscar pontos de monitoramento', maxLength: 120 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        select
        label="Tipo da máquina"
        value={filters.machineType ?? ''}
        onChange={(event) =>
          dispatch(
            filtersChanged({ machineType: (event.target.value || null) as MachineType | null }),
          )
        }
        size="small"
        sx={{ minWidth: { md: 168 } }}
        inputProps={{ 'aria-label': 'Filtrar por tipo da máquina' }}
      >
        <MenuItem value="">Todos</MenuItem>
        {MACHINE_TYPES.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Modelo do sensor"
        value={filters.sensorModel ?? ''}
        onChange={(event) =>
          dispatch(
            filtersChanged({ sensorModel: (event.target.value || null) as SensorModel | null }),
          )
        }
        size="small"
        sx={{ minWidth: { md: 172 } }}
        inputProps={{ 'aria-label': 'Filtrar por modelo do sensor' }}
      >
        <MenuItem value="">Todos</MenuItem>
        {SENSOR_MODELS.map((model) => (
          <MenuItem key={model} value={model}>
            {model}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Sensor"
        value={filters.hasSensor === null ? '' : String(filters.hasSensor)}
        onChange={(event) =>
          dispatch(
            filtersChanged({
              hasSensor: event.target.value === '' ? null : event.target.value === 'true',
            }),
          )
        }
        size="small"
        sx={{ minWidth: { md: 150 } }}
        inputProps={{ 'aria-label': 'Filtrar por presença de sensor' }}
      >
        <MenuItem value="">Todos</MenuItem>
        <MenuItem value="true">Com sensor</MenuItem>
        <MenuItem value="false">Sem sensor</MenuItem>
      </TextField>
      <Button
        onClick={() => dispatch(filtersCleared())}
        disabled={!hasActiveFilters || busy}
        startIcon={<ClearIcon />}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Limpar
      </Button>
    </Stack>
  );
}
