import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import type { TimeSeriesSummary } from '@dynamox/domain';

import { seriesMetricLabel } from '../../features/dashboard/dashboardFormatters';

function unique(values: Array<string | null>): string[] {
  return [...new Set(values.flatMap((value) => (value ? [value] : [])))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  );
}

function firstSeries(series: TimeSeriesSummary[]): TimeSeriesSummary | null {
  return (
    series.find((item) => item.physicalQuantity === 'acceleration' && item.axis === 'y') ??
    series.find((item) => item.lastTimestamp !== null) ??
    series[0] ??
    null
  );
}

export interface SeriesHierarchyFiltersProps {
  series: TimeSeriesSummary[];
  selectedSeriesId: string | null;
  onSelect: (seriesId: string) => void;
  compact?: boolean;
}

export function SeriesHierarchyFilters({
  series,
  selectedSeriesId,
  onSelect,
  compact = false,
}: SeriesHierarchyFiltersProps): JSX.Element {
  const selected = series.find((item) => item.id === selectedSeriesId) ?? null;
  const machines = unique(series.map((item) => item.machineName));
  const machineName = selected?.machineName ?? machines[0] ?? null;
  const inMachine = series.filter((item) => item.machineName === machineName);
  const points = unique(inMachine.map((item) => item.monitoringPointName));
  const pointName = selected?.monitoringPointName ?? points[0] ?? null;
  const inPoint = inMachine.filter((item) => item.monitoringPointName === pointName);
  const sensors = unique(inPoint.map((item) => item.sensorSerialNumber));
  const sensorSerial = selected?.sensorSerialNumber ?? sensors[0] ?? null;
  const metrics = inPoint.filter((item) => item.sensorSerialNumber === sensorSerial);

  const selectFirst = (candidates: TimeSeriesSummary[]) => {
    const next = firstSeries(candidates);
    if (next) onSelect(next.id);
  };

  return (
    <Box
      aria-label="Filtros hierárquicos da série"
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
        gap: compact ? 0.5 : 1,
        minWidth: 0,
      }}
    >
      <Autocomplete
        size="small"
        options={machines}
        value={machineName}
        onChange={(_event, value) => {
          if (value) selectFirst(series.filter((item) => item.machineName === value));
        }}
        renderInput={(params) => <TextField {...params} label={compact ? 'Máquina' : '1. Máquina'} />}
        noOptionsText="Nenhuma máquina com série"
      />
      <Autocomplete
        size="small"
        options={points}
        value={pointName}
        disabled={!machineName}
        onChange={(_event, value) => {
          if (value) selectFirst(inMachine.filter((item) => item.monitoringPointName === value));
        }}
        renderInput={(params) => <TextField {...params} label={compact ? 'Ponto' : '2. Ponto'} />}
        noOptionsText="Nenhum ponto com série"
      />
      <Autocomplete
        size="small"
        options={sensors}
        value={sensorSerial}
        disabled={!pointName}
        onChange={(_event, value) => {
          if (value) selectFirst(inPoint.filter((item) => item.sensorSerialNumber === value));
        }}
        renderInput={(params) => <TextField {...params} label={compact ? 'Sensor' : '3. Sensor'} />}
        noOptionsText="Nenhum sensor com série"
      />
      <Autocomplete
        size="small"
        options={metrics}
        value={selected && metrics.some((item) => item.id === selected.id) ? selected : metrics[0] ?? null}
        disabled={!sensorSerial}
        getOptionLabel={(option) => seriesMetricLabel(option.physicalQuantity, option.axis)}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_event, value) => {
          if (value) onSelect(value.id);
        }}
        renderInput={(params) => <TextField {...params} label={compact ? 'Eixo / métrica' : '4. Eixo / métrica'} />}
        noOptionsText="Sensor sem séries"
      />
    </Box>
  );
}
