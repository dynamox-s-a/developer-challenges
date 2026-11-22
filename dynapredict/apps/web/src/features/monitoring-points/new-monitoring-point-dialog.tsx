import { useEffect, useState, type FormEvent } from 'react';
import { z } from 'zod';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { monitoringPointSchema } from '@dynapredict/shared';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMachines } from '../machines/machines.slice';
import { createMonitoringPoint } from './monitoring-points.slice';

// O formulário: o nome segue o schema do shared (o mesmo da API) e a
// máquina, que na API vai na URL, só precisa ter sido escolhida
const formSchema = monitoringPointSchema.extend({
  machineId: z.string().min(1, 'Escolha a máquina'),
});

type FormValues = { machineId: string; name: string };

// Ex.: { name: ['Informe o nome do ponto'] }
type FieldErrors = Partial<Record<keyof FormValues, string[]>>;

type NewMonitoringPointDialogProps = {
  onClose: () => void;
  // Chamado depois de salvar, com a mensagem de sucesso
  onCreated: (message: string) => void;
};

export function NewMonitoringPointDialog({
  onClose,
  onCreated,
}: NewMonitoringPointDialogProps) {
  const dispatch = useAppDispatch();
  const machines = useAppSelector((state) => state.machines);

  const [values, setValues] = useState<FormValues>({ machineId: '', name: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // As opções de máquina vêm da lista de máquinas. Se ninguém buscou ainda
  // (a página de máquinas não foi aberta), busca agora
  useEffect(() => {
    if (machines.status === 'idle') {
      dispatch(fetchMachines());
    }
  }, [dispatch, machines.status]);

  // Em ordem alfabética, para achar a máquina mais fácil
  const machineOptions = [...machines.items].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR'),
  );

  // Uma dica embaixo do campo enquanto as opções não estão prontas
  let machinesHint: string | undefined;
  if (machines.status === 'loading') {
    machinesHint = 'Carregando máquinas...';
  } else if (machines.status === 'failed') {
    machinesHint = machines.error ?? 'Erro ao carregar as máquinas';
  } else if (machines.status === 'succeeded' && machineOptions.length === 0) {
    machinesHint = 'Cadastre uma máquina primeiro';
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = formSchema.safeParse(values);
    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors);
      return;
    }
    setFieldErrors({});
    setSubmitError(null);
    setSaving(true);

    try {
      await dispatch(createMonitoringPoint(result.data)).unwrap();
      onCreated('Ponto criado');
    } catch (error) {
      setSubmitError(typeof error === 'string' ? error : 'Erro inesperado');
    } finally {
      setSaving(false);
    }
  }

  return (
    // Como no diálogo de máquinas: a página só o desenha quando está aberto
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>Novo ponto de monitoramento</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {submitError && <Alert severity="error">{submitError}</Alert>}

            <TextField
              select
              label="Máquina"
              autoFocus
              fullWidth
              value={values.machineId}
              onChange={(e) =>
                setValues({ ...values, machineId: e.target.value })
              }
              disabled={machineOptions.length === 0}
              error={Boolean(fieldErrors.machineId)}
              helperText={machinesHint ?? fieldErrors.machineId?.[0]}
            >
              {machineOptions.map((machine) => (
                <MenuItem key={machine.id} value={machine.id}>
                  {machine.name} ({machine.type})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Nome do ponto"
              fullWidth
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              error={Boolean(fieldErrors.name)}
              helperText={fieldErrors.name?.[0]}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
