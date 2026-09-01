import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';

/** Categorias de altura mínima — ver `theme.dashboard.cardMinHeight`. */
export type DashboardCardSize = keyof Theme['dashboard']['cardMinHeight'];

/**
 * Superfície padrão dos painéis: cabeçalho compacto (título, contexto, ação) e corpo que
 * ocupa a altura restante. O card sempre estica na linha do grid (`height: 100%`) e recebe
 * a altura mínima da sua categoria, de modo que cards vizinhos fiquem alinhados sem que
 * ninguém precise fixar pixels em cada arquivo.
 */
export interface DashboardCardProps {
  title: string;
  titleId?: string;
  subtitle?: ReactNode;
  /** Texto do tooltip de contexto ao lado do título. */
  info?: string;
  /** Conteúdo alinhado à direita do cabeçalho (chips, tabs, contagem). */
  action?: ReactNode;
  /** Remove o padding lateral do corpo — para tabelas encostarem nas bordas. */
  flush?: boolean;
  /** Piso de altura — só para cards que desenham gráfico; os demais seguem o conteúdo. */
  size?: DashboardCardSize;
  children: ReactNode;
}

export function DashboardCard({
  title,
  titleId,
  subtitle,
  info,
  action,
  flush = false,
  size,
  children,
}: DashboardCardProps): JSX.Element {
  return (
    <Card
      variant="outlined"
      component="section"
      aria-labelledby={titleId}
      sx={(muiTheme) => ({
        minWidth: 0,
        width: '100%',
        height: '100%',
        minHeight: size ? muiTheme.dashboard.cardMinHeight[size] : undefined,
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <Stack
        className="DashboardCard-header"
        // Em telas estreitas a ação desce para baixo do título; lado a lado, ela
        // esmagava o subtítulo a uma coluna de uma palavra por linha.
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
        gap={{ xs: 0.5, sm: 1 }}
        sx={(muiTheme) => ({
          minHeight: muiTheme.dashboard.headerHeight,
          px: `${muiTheme.dashboard.cardPadding}px`,
          pt: 1.5,
          pb: 0.75,
          minWidth: 0,
        })}
      >
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Typography id={titleId} variant="h2" component="h2" noWrap>
              {title}
            </Typography>
            {info ? (
              <Tooltip title={info} arrow>
                <InfoOutlinedIcon
                  sx={{ fontSize: 15, color: 'text.secondary' }}
                  aria-label={`Sobre: ${title}`}
                />
              </Tooltip>
            ) : null}
          </Stack>
          {subtitle ? (
            <Typography variant="caption" color="text.secondary" component="div">
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {action ? <Box sx={{ flexShrink: 1, minWidth: 0 }}>{action}</Box> : null}
      </Stack>

      <Box
        className="DashboardCard-content"
        sx={(muiTheme) => ({
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          px: flush ? 0 : `${muiTheme.dashboard.cardPadding}px`,
          pb: flush ? 0 : 2,
          pt: 0.5,
        })}
      >
        {children}
      </Box>
    </Card>
  );
}
