import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

/**
 * Faixa compacta de indicadores das páginas de investigação.
 *
 * Deliberadamente mais simples que os KPIs da home: aqui o contexto já está estabelecido
 * pela URL e pelo breadcrumb, então cada número precisa de rótulo e valor, não de um card
 * com ícone e narrativa.
 */
export interface KpiItem {
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'warning' | 'error';
}

export function KpiStrip({ items }: { items: KpiItem[] }): JSX.Element {
  return (
    <Box
      component="section"
      aria-label="Indicadores da investigação"
      sx={(theme) => ({
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          md: `repeat(${Math.min(items.length, 6)}, minmax(0, 1fr))`,
        },
        gap: `${theme.dashboard.gridGap}px`,
      })}
    >
      {items.map((item) => (
        <Card
          key={item.label}
          variant="outlined"
          sx={(theme) => ({ px: `${theme.dashboard.cardPadding}px`, py: 1.25, minWidth: 0 })}
        >
          {/* O rótulo quebra em vez de truncar: em duas colunas no celular, "Maior desvio
              radi…" não diz o que o número mede. */}
          <Typography
            variant="overline"
            color="text.secondary"
            component="div"
            sx={{ lineHeight: 1.3, minHeight: { xs: 'auto', md: 18 } }}
          >
            {item.label}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 750,
              lineHeight: 1.15,
              color:
                item.tone === 'warning'
                  ? 'condition.attention'
                  : item.tone === 'error'
                    ? 'error.main'
                    : 'text.primary',
            }}
          >
            {item.value}
          </Typography>
          {item.hint ? (
            <Typography variant="caption" color="text.secondary" component="div" noWrap title={item.hint}>
              {item.hint}
            </Typography>
          ) : null}
        </Card>
      ))}
    </Box>
  );
}
