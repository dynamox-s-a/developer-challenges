import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { machineSlug, resolveByNaturalKey } from '@dynamox/domain';
import { EmptyState, ErrorState, LoadingState } from '@dynamox/ui';

import { api } from '../../api/client';
import { PageHeader } from '../../components/PageHeader';
import { selectCanMutate } from '../../features/auth/authSlice';
import { useAnalyticsQuery, useTimeRange } from '../../features/investigation/useAnalyticsQuery';
import { links } from '../../features/investigation/links';
import { useAppSelector } from '../../store';

const NAME_MAX_LENGTH = 120;

/**
 * Cadastro de ponto DENTRO da máquina.
 *
 * O ponto pertence à máquina — a rota diz isso, e por isso não há um seletor de máquina no
 * formulário: quem chegou aqui já escolheu. Um campo a menos que só repetiria o que a URL
 * já afirma.
 *
 * O sensor não é pedido aqui: associar sensor tem regra própria (modelo compatível com o
 * tipo da máquina, um sensor por ponto) e acontece na página do ponto, logo depois.
 */
export function PointFormPage(): JSX.Element {
  const { machineKey = '' } = useParams();
  const navigate = useNavigate();
  const range = useTimeRange();
  const canMutate = useAppSelector(selectCanMutate);

  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const machines = useAnalyticsQuery(() => api.machines(), []);
  const resolved = machines.data
    ? resolveByNaturalKey(machines.data, machineKey, (machine) => machine.name)
    : null;
  const machine = resolved?.kind === 'found' ? resolved.item : null;

  const trimmed = name.trim();
  const nameError =
    trimmed === ''
      ? 'Informe o nome do ponto.'
      : trimmed.length > NAME_MAX_LENGTH
        ? `O nome deve ter no máximo ${NAME_MAX_LENGTH} caracteres.`
        : null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (nameError || saving || !machine) return;

    setSaving(true);
    setFailure(null);
    try {
      const created = await api.createMonitoringPoint(machine.id, trimmed);
      navigate(links.point(machine.name, created.name, range));
    } catch (reason) {
      setFailure(reason instanceof Error ? reason.message : 'Não foi possível criar o ponto.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ pb: 3 }}>
      <PageHeader
        steps={[
          { label: 'Visão geral', to: '/' },
          { label: 'Máquinas', to: '/machines' },
          ...(machine
            ? [{ label: machine.name, to: `/machines/${encodeURIComponent(machineSlug(machine.name))}` }]
            : []),
          { label: 'Novo ponto' },
        ]}
        title="Novo ponto de monitoramento"
        subtitle={
          machine
            ? `O ponto será criado em ${machine.name}. O sensor é associado depois, na página do ponto.`
            : 'Ponto de monitoramento.'
        }
      />

      {!canMutate ? (
        <Alert severity="info">
          Seu perfil é somente leitura: cadastrar pontos exige um perfil administrador.
        </Alert>
      ) : null}

      {machines.status === 'loading' || machines.status === 'idle' ? (
        <LoadingState label="Carregando a máquina…" />
      ) : null}
      {machines.status === 'failed' ? (
        <ErrorState message={machines.error ?? 'Não foi possível carregar a máquina.'} onRetry={machines.reload} />
      ) : null}
      {machines.status === 'succeeded' && !machine ? (
        <EmptyState
          title="Máquina não encontrada"
          description={`Nenhuma máquina cadastrada corresponde a "${machineKey}".`}
          action={
            <Button onClick={() => navigate('/machines')} variant="outlined" size="small">
              Voltar às máquinas
            </Button>
          }
        />
      ) : null}

      {canMutate && machine ? (
        <Card variant="outlined" sx={{ maxWidth: 720 }}>
          <Box component="form" onSubmit={submit} noValidate sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              {failure ? <Alert severity="error">{failure}</Alert> : null}

              <TextField
                label="Nome do ponto"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onBlur={() => setTouched(true)}
                error={touched && nameError !== null}
                helperText={
                  touched && nameError
                    ? nameError
                    : 'Único dentro da máquina (ex.: "Mancal lado acoplamento").'
                }
                disabled={saving}
                fullWidth
                autoFocus
                inputProps={{ 'aria-label': 'Nome do ponto', maxLength: NAME_MAX_LENGTH }}
              />

              <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ pt: 1 }}>
                <Button
                  onClick={() => navigate(`/machines/${encodeURIComponent(machineSlug(machine.name))}`)}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
                >
                  {saving ? 'Criando…' : 'Criar ponto'}
                </Button>
              </Stack>

              <Typography variant="caption" color="text.secondary">
                Após criar, você vai para a página do ponto — é lá que o sensor é associado.
              </Typography>
            </Stack>
          </Box>
        </Card>
      ) : null}
    </Box>
  );
}
