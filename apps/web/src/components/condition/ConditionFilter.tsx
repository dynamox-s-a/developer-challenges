import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import {
  CONDITION_KINDS,
  EMPTY_CONDITION_COUNTS,
  conditionCountKey,
  type ConditionCounts,
  type ConditionKind,
} from '@dynamox/domain';

import { conditionColor } from './ConditionTag';

const LABELS: Record<ConditionKind, string> = {
  attention: 'Atenção',
  observation: 'Observação',
  normal: 'Normal',
  unclassified: 'Sem classificação',
  'no-data': 'Sem dados',
  'no-sensor': 'Sem sensor',
};

/**
 * Recorte por condição.
 *
 * Duas decisões que evitam um seletor decorativo:
 *
 * 1. **Só aparecem os estados que existem na janela.** Um botão "Sem sensor" numa planta
 *    inteiramente instrumentada é uma opção que nunca devolve nada — ocupa espaço e ensina
 *    a pessoa a desconfiar do filtro. A contagem vem do servidor, do universo ANTES do
 *    recorte, então o botão ativo continua mostrando quantos itens ele tem.
 * 2. **O vocabulário é o do domínio, e só ele.** Não existe "crítico" na regra de condição
 *    deste produto; inventar a opção para preencher o seletor seria prometer uma
 *    classificação que nada calcula.
 */
export interface ConditionFilterProps {
  /** Contagens do servidor. Parcial ou ausente não derruba a tela: o filtro some. */
  counts: Partial<ConditionCounts> | null | undefined;
  value: ConditionKind | null;
  onChange: (condition: ConditionKind | null) => void;
  /** Rótulo acessível do grupo — o contexto muda ("máquinas", "pontos"). */
  label: string;
  size?: 'small' | 'medium';
}

/**
 * Sentinela do "sem filtro". `value={null}` num ToggleButton é o mesmo que "prop ausente"
 * para o MUI (e rende um aviso de propType), então a ausência de recorte tem um valor
 * próprio aqui e vira `null` na fronteira do componente.
 */
const ALL = '__all__' as const;

export function ConditionFilter({
  counts,
  value,
  onChange,
  label,
  size = 'small',
}: ConditionFilterProps): JSX.Element | null {
  const safe: ConditionCounts = { ...EMPTY_CONDITION_COUNTS, ...(counts ?? {}) };
  const present = CONDITION_KINDS.filter((kind) => safe[conditionCountKey(kind)] > 0);
  // Um único estado presente não é um filtro: é uma constatação. A contagem total já a faz.
  if (present.length < 2) return null;

  return (
    <ToggleButtonGroup
      exclusive
      size={size}
      value={value ?? ALL}
      aria-label={label}
      onChange={(_event, next: ConditionKind | typeof ALL | null) => onChange(next === null || next === ALL ? null : next)}
      sx={{ flexWrap: 'wrap' }}
    >
      <ToggleButton value={ALL} aria-label={`Todos — ${safe.total}`} sx={{ px: 1.5 }}>
        Todos
        <Count>{safe.total}</Count>
      </ToggleButton>
      {present.map((kind) => (
        <ToggleButton
          key={kind}
          value={kind}
          aria-label={`${LABELS[kind]} — ${safe[conditionCountKey(kind)]}`}
          sx={(theme) => ({
            px: 1.5,
            '&.Mui-selected': {
              color: conditionColor(kind, theme.palette),
              bgcolor: alpha(conditionColor(kind, theme.palette), 0.12),
              '&:hover': { bgcolor: alpha(conditionColor(kind, theme.palette), 0.18) },
            },
          })}
        >
          <Box
            aria-hidden="true"
            component="span"
            sx={(theme) => ({
              width: 7,
              height: 7,
              borderRadius: '50%',
              mr: 0.75,
              flexShrink: 0,
              bgcolor: conditionColor(kind, theme.palette),
            })}
          />
          {LABELS[kind]}
          <Count>{safe[conditionCountKey(kind)]}</Count>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

/** Contagem discreta ao lado do rótulo: contexto, não o assunto do botão. */
function Count({ children }: { children: number }): JSX.Element {
  return (
    <Typography
      component="span"
      variant="caption"
      sx={{ ml: 0.75, opacity: 0.65, fontVariantNumeric: 'tabular-nums' }}
    >
      {children}
    </Typography>
  );
}
