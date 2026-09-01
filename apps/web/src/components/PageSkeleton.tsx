import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

/**
 * Esqueleto de página analítica.
 *
 * Um spinner centralizado diz "espere" e some; um esqueleto diz "vem aqui um bloco de
 * indicadores, um gráfico e uma tabela" — e o conteúdo aparece no lugar onde o olho já
 * estava. Como o layout destas páginas é conhecido de antemão, o esqueleto pode reproduzi-lo
 * em vez de esconder a página inteira atrás de um círculo girando.
 */
export function PageSkeleton({
  kpis = 4,
  chart = true,
  rows = 4,
}: {
  kpis?: number;
  chart?: boolean;
  rows?: number;
}): JSX.Element {
  return (
    <Box role="status" aria-live="polite" aria-label="Carregando a página">
      <Box
        sx={(theme) => ({
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            md: `repeat(${kpis}, minmax(0, 1fr))`,
          },
          gap: `${theme.dashboard.gridGap}px`,
          mb: `${theme.dashboard.gridGap}px`,
        })}
      >
        {Array.from({ length: kpis }, (_, index) => (
          <Skeleton key={index} variant="rounded" height={78} />
        ))}
      </Box>

      {chart ? (
        <Box
          sx={(theme) => ({
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: `${theme.dashboard.gridGap}px`,
            mb: `${theme.dashboard.gridGap}px`,
          })}
        >
          <Skeleton variant="rounded" height={280} />
          <Skeleton variant="rounded" height={280} sx={{ display: { xs: 'none', lg: 'block' } }} />
        </Box>
      ) : null}

      <Card variant="outlined">
        <Stack spacing={1} sx={(theme) => ({ p: `${theme.dashboard.cardPadding}px` })}>
          <Skeleton variant="text" height={22} width="30%" />
          {Array.from({ length: rows }, (_, index) => (
            <Skeleton key={index} variant="text" height={28} />
          ))}
        </Stack>
      </Card>
    </Box>
  );
}
