import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

/**
 * Seletor de período das páginas de investigação.
 *
 * O recorte vive na URL, então trocar de período é navegação — não estado escondido. O
 * bucket acompanha o período porque é ele que mantém o gráfico com dezenas de pontos em vez
 * de centenas de milhares: 24 h em 15 min, 7 dias em 1 h, 30 dias em 4 h.
 */
export const RANGE_PRESETS = [
  { id: '24h', label: '24 h', days: 1, bucket: '15m' },
  { id: '7d', label: '7 dias', days: 7, bucket: '1h' },
  { id: '30d', label: '30 dias', days: 30, bucket: '4h' },
] as const;

export type RangePreset = (typeof RANGE_PRESETS)[number];

/** Preset cujo tamanho mais se aproxima da janela atual — para marcar o botão ativo. */
export function presetForRange(from: string, to: string): RangePreset['id'] | null {
  const days = (Date.parse(to) - Date.parse(from)) / 86_400_000;
  if (!Number.isFinite(days)) return null;
  const closest = RANGE_PRESETS.reduce((best, preset) =>
    Math.abs(preset.days - days) < Math.abs(best.days - days) ? preset : best,
  );
  return Math.abs(closest.days - days) <= closest.days * 0.2 ? closest.id : null;
}

export function RangePresets({
  from,
  to,
  onSelect,
}: {
  from: string;
  to: string;
  onSelect: (preset: RangePreset) => void;
}): JSX.Element {
  const active = presetForRange(from, to);
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={active}
      aria-label="Período consultado"
      sx={{ alignSelf: { md: 'flex-start' } }}
    >
      {RANGE_PRESETS.map((preset) => (
        <ToggleButton
          key={preset.id}
          value={preset.id}
          aria-label={preset.label}
          onClick={() => onSelect(preset)}
          sx={{ px: 1.75 }}
        >
          {preset.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
