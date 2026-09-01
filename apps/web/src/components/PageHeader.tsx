import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

import { InvestigationBreadcrumbs, type BreadcrumbStep } from './investigation/InvestigationBreadcrumbs';

/**
 * Cabeçalho de página: trilha, identidade, contexto e ações — nada de card.
 *
 * Um só nível de título por página. A barra da aplicação já é o cabeçalho do produto; aqui
 * fica quem é o recurso, em que estado ele está e o que dá para fazer com ele. Investigação
 * e cadastro usam o MESMO cabeçalho de propósito: são a mesma aplicação, não dois sistemas.
 */
export interface PageHeaderProps {
  steps: BreadcrumbStep[];
  title: string;
  /** Complemento curto do título: tipo do ativo, ponto e sensor, modelo. */
  subtitle?: ReactNode;
  /** Etiquetas de estado e de recorte — informação, nunca ação. */
  chips?: ReactNode;
  /** Ações da página (seletor de período, botão de destino). */
  actions?: ReactNode;
}

export function PageHeader({
  steps,
  title,
  subtitle,
  chips,
  actions,
}: PageHeaderProps): JSX.Element {
  return (
    <Box sx={{ pt: 2, pb: 1.5 }}>
      <InvestigationBreadcrumbs steps={steps} />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'flex-start' }}
        gap={1.5}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h1" component="h1" noWrap title={title}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.25 }}>
              {subtitle}
            </Typography>
          ) : null}
          {chips ? (
            <Stack direction="row" gap={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
              {chips}
            </Stack>
          ) : null}
        </Box>
        {actions ? <Box sx={{ flexShrink: 0 }}>{actions}</Box> : null}
      </Stack>
    </Box>
  );
}

/** Etiqueta de recorte temporal, com o fuso declarado uma vez por página. */
export function RangeChip({ label }: { label: string }): JSX.Element {
  return <Chip size="small" variant="outlined" label={label} />;
}
