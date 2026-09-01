import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  MACHINE_TYPES,
  isMachineType,
  machineSlug,
  resolveByNaturalKey,
  type MachineType,
} from '@dynamox/domain';
import { EmptyState, ErrorState, LoadingState } from '@dynamox/ui';

import { api, type MachineDto } from '../../api/client';
import { PageHeader } from '../../components/PageHeader';
import { selectCanMutate } from '../../features/auth/authSlice';
import { createMachine, updateMachine, selectMachines } from '../../features/machines/machinesSlice';
import { useAnalyticsQuery } from '../../features/investigation/useAnalyticsQuery';
import { useAppDispatch, useAppSelector } from '../../store';

/** Mesmo teto aplicado pela API; a validação local só antecipa a mensagem. */
const NAME_MAX_LENGTH = 120;

const TYPE_LABELS: Record<MachineType, string> = { Pump: 'Bomba', Fan: 'Ventilador' };

function validateName(value: string): string | null {
  if (value === '') return 'Informe o nome da máquina.';
  return value.length > NAME_MAX_LENGTH
    ? `O nome deve ter no máximo ${NAME_MAX_LENGTH} caracteres.`
    : null;
}

/**
 * Formulário de máquina — criação e edição na MESMA composição, distinguidas pela rota.
 *
 * Página dedicada, não modal: `/machines/P-101/edit` é endereçável, sobrevive a um refresh
 * e pode ser compartilhada. Um formulário que só existe enquanto um estado do Redux estiver
 * de pé não é uma tela, é um momento.
 *
 * Largura contida (720 px) porque um campo de texto de 1.400 px não fica mais fácil de
 * preencher — fica mais difícil de ler.
 */
export function MachineFormPage({ mode }: { mode: 'create' | 'edit' }): JSX.Element {
  const { machineKey = '' } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const canMutate = useAppSelector(selectCanMutate);
  const { createStatus, createError, updateStatus, updateError } = useAppSelector(selectMachines);

  const [name, setName] = useState('');
  const [type, setType] = useState<MachineType>('Pump');
  const [touched, setTouched] = useState(false);

  // Na edição, o formulário parte do estado persistido — resolvido pelo mesmo
  // identificador legível que a URL carrega.
  const existing = useAnalyticsQuery(
    () => (mode === 'edit' ? api.machines() : Promise.resolve([] as MachineDto[])),
    [mode, machineKey],
  );
  const resolved =
    mode === 'edit' && existing.data
      ? resolveByNaturalKey(existing.data, machineKey, (machine) => machine.name)
      : null;
  const machine = resolved?.kind === 'found' ? resolved.item : null;

  useEffect(() => {
    if (machine) {
      setName(machine.name);
      setType(machine.type);
    }
  }, [machine]);

  const trimmed = name.trim();
  const nameError = validateName(trimmed);
  const saving = mode === 'create' ? createStatus === 'loading' : updateStatus === 'loading';
  const failure = mode === 'create' ? createError : updateError;
  const failed = (mode === 'create' ? createStatus : updateStatus) === 'failed';

  const cancel = () => {
    navigate(machine ? `/machines/${encodeURIComponent(machineSlug(machine.name))}` : '/machines');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (nameError || saving) return;

    if (mode === 'create') {
      const result = await dispatch(createMachine({ name: trimmed, type }));
      // Só navega quando a API confirma; em erro, o que foi digitado continua na tela.
      if (createMachine.fulfilled.match(result)) {
        navigate(`/machines/${encodeURIComponent(machineSlug(result.payload.name))}`);
      }
      return;
    }

    if (!machine) return;
    const result = await dispatch(
      updateMachine({ id: machine.id, changes: { name: trimmed, type } }),
    );
    if (updateMachine.fulfilled.match(result)) {
      navigate(`/machines/${encodeURIComponent(machineSlug(result.payload.name))}`);
    }
  };

  const title = mode === 'create' ? 'Nova máquina' : `Editar ${machine?.name ?? machineKey}`;

  return (
    <Box sx={{ pb: 3 }}>
      <PageHeader
        steps={[
          { label: 'Visão geral', to: '/' },
          { label: 'Máquinas', to: '/machines' },
          ...(mode === 'edit' && machine
            ? [{ label: machine.name, to: `/machines/${encodeURIComponent(machineSlug(machine.name))}` }]
            : []),
          { label: mode === 'create' ? 'Nova' : 'Editar' },
        ]}
        title={title}
        subtitle={
          mode === 'create'
            ? 'Nome e tipo definem o ativo. Os pontos de monitoramento são cadastrados depois, dentro da máquina.'
            : 'Alterações valem para todas as telas que mostram este ativo.'
        }
      />

      {!canMutate ? (
        <Alert severity="info">
          Seu perfil é somente leitura: criar e editar máquinas exigem um perfil administrador.
        </Alert>
      ) : null}

      {mode === 'edit' && (existing.status === 'loading' || existing.status === 'idle') ? (
        <LoadingState label="Carregando a máquina…" />
      ) : null}
      {mode === 'edit' && existing.status === 'failed' ? (
        <ErrorState message={existing.error ?? 'Não foi possível carregar a máquina.'} onRetry={existing.reload} />
      ) : null}
      {mode === 'edit' && existing.status === 'succeeded' && !machine ? (
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

      {canMutate && (mode === 'create' || machine) ? (
        <Card variant="outlined" sx={{ maxWidth: 720 }}>
          <Box component="form" onSubmit={submit} noValidate sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              {failed && failure ? <Alert severity="error">{failure}</Alert> : null}

              <TextField
                label="Nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onBlur={() => setTouched(true)}
                error={touched && nameError !== null}
                helperText={
                  touched && nameError
                    ? nameError
                    : 'Identificação usada em toda a aplicação e no endereço da máquina (ex.: P-101).'
                }
                disabled={saving}
                fullWidth
                autoFocus
                inputProps={{ 'aria-label': 'Nome', maxLength: NAME_MAX_LENGTH }}
              />

              <TextField
                select
                label="Tipo"
                value={type}
                onChange={(event) => {
                  if (isMachineType(event.target.value)) setType(event.target.value);
                }}
                disabled={saving}
                helperText="Bombas não aceitam sensores TcAg e TcAs — a regra é aplicada ao associar o sensor."
                sx={{ maxWidth: 260 }}
                inputProps={{ 'aria-label': 'Tipo' }}
              >
                {MACHINE_TYPES.map((machineType) => (
                  <MenuItem key={machineType} value={machineType}>
                    {TYPE_LABELS[machineType]} ({machineType})
                  </MenuItem>
                ))}
              </TextField>

              <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ pt: 1 }}>
                <Button onClick={cancel} disabled={saving}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
                >
                  {mode === 'create'
                    ? saving
                      ? 'Criando…'
                      : 'Criar máquina'
                    : saving
                      ? 'Salvando…'
                      : 'Salvar alterações'}
                </Button>
              </Stack>

              <Typography variant="caption" color="text.secondary">
                Cancelar descarta as alterações e volta{' '}
                {mode === 'create' ? 'à listagem' : 'ao detalhe da máquina'}.
              </Typography>
            </Stack>
          </Box>
        </Card>
      ) : null}
    </Box>
  );
}
