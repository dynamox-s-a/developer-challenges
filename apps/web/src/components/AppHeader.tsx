import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';

import { API_BASE_URL } from '../api/client';
import { logout, selectAuthenticatedUser } from '../features/auth/authSlice';
import { fetchHealth, selectDiagnostics } from '../features/diagnostics/diagnosticsSlice';
import { useAppDispatch, useAppSelector } from '../store';

export interface AppHeaderProps {
  /** Abre a navegação temporária; ausente em desktop, onde a sidebar é permanente. */
  onOpenNavigation?: () => void;
}

/**
 * Barra única da aplicação: estado da API/banco à esquerda, sessão à direita. É uma faixa
 * (`header` + borda inferior), não um card — o conteúdo da página começa logo abaixo, sem
 * uma segunda camada de cabeçalho.
 */
export function AppHeader({ onOpenNavigation }: AppHeaderProps): JSX.Element {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthenticatedUser);
  const { healthStatus, health, healthError } = useAppSelector(selectDiagnostics);
  const loading = healthStatus === 'loading' || healthStatus === 'idle';

  useEffect(() => {
    void dispatch(fetchHealth());
  }, [dispatch]);

  return (
    <Box
      component="header"
      aria-label="Estado do sistema e sessão"
      sx={(muiTheme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        minHeight: muiTheme.dashboard.appBarHeight,
        px: { xs: 2, md: 3 },
        py: 0.5,
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        zIndex: muiTheme.zIndex.appBar,
      })}
    >
      {onOpenNavigation ? (
        <IconButton
          aria-label="Abrir menu de navegação"
          edge="start"
          size="small"
          onClick={onOpenNavigation}
        >
          <MenuIcon />
        </IconButton>
      ) : null}

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
        sx={{ minWidth: 0, flexGrow: 1 }}
      >
        {loading ? (
          <>
            <Skeleton variant="rounded" width={112} height={24} />
            <Skeleton variant="rounded" width={124} height={24} />
          </>
        ) : null}

        {healthStatus === 'failed' ? (
          <>
            <Chip
              icon={<ErrorOutlineIcon />}
              label="API indisponível"
              color="error"
              size="small"
              variant="outlined"
            />
            <Chip label="Banco: não verificado" size="small" variant="outlined" />
            <Tooltip title="Consultar o estado novamente">
              <IconButton
                size="small"
                aria-label="Atualizar estado do sistema"
                onClick={() => void dispatch(fetchHealth())}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography
              variant="caption"
              color="error.main"
              sx={{ display: { xs: 'none', md: 'block' }, overflowWrap: 'anywhere' }}
            >
              {healthError ?? `A API local não respondeu em ${API_BASE_URL}.`}
            </Typography>
          </>
        ) : null}

        {healthStatus === 'succeeded' && health ? (
          <>
            <Chip
              icon={health.status === 'ok' ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
              label={`API: ${health.status === 'ok' ? 'operacional' : 'degradada'}`}
              color={health.status === 'ok' ? 'success' : 'warning'}
              size="small"
              variant="outlined"
            />
            <Chip
              icon={health.database === 'up' ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
              label={`Banco: ${health.database === 'up' ? 'operacional' : 'indisponível'}`}
              color={health.database === 'up' ? 'success' : 'error'}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`v${health.version}`}
              size="small"
              variant="outlined"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            />
          </>
        ) : null}
      </Stack>

      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ flexShrink: 0 }}>
        <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', fontSize: '0.78rem' }}>
          {(user?.name ?? user?.email ?? '?').charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ minWidth: 0, display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="body2" noWrap sx={{ maxWidth: { sm: 200, md: 280 }, fontWeight: 600 }}>
            {user?.email ?? 'Usuário autenticado'}
          </Typography>
          <Typography variant="caption" color="text.secondary" component="div" sx={{ lineHeight: 1.2 }}>
            Sessão autenticada
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<LogoutIcon />}
          aria-label="Sair da sessão"
          onClick={() => void dispatch(logout())}
        >
          Sair
        </Button>
      </Stack>
    </Box>
  );
}
