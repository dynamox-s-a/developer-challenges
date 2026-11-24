import { useState, type FormEvent } from 'react';
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
import {
  MACHINE_TYPES,
  machineSchema,
  type MachineInput,
} from '@dynapredict/shared';
import { useAppDispatch } from '../../app/hooks';
import { createMachine, updateMachine, type Machine } from './machines.slice';

// O que está digitado no formulário. O tipo começa vazio (''), até a pessoa
// escolher; quem garante que no fim ele é Pump ou Fan é o schema
type FormValues = { name: string; type: string };

// Ex.: { name: ['Informe o nome da máquina'] }
type FieldErrors = Partial<Record<keyof MachineInput, string[]>>;

type MachineFormDialogProps = {
  // A máquina que está sendo editada, ou null para cadastrar uma nova
  machine: Machine | null;
  onClose: () => void;
  // Chamado depois de salvar, com a mensagem de sucesso
  onSaved: (message: string) => void;
};

export function MachineFormDialog({
  machine,
  onClose,
  onSaved,
}: MachineFormDialogProps) {
  const dispatch = useAppDispatch();

  // Editando? O formulário já começa preenchido com os dados da máquina
  const [values, setValues] = useState<FormValues>({
    name: machine?.name ?? '',
    type: machine?.type ?? '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // 1. Valida no front, com o MESMO schema que a API usa
    const result = machineSchema.safeParse(values);
    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors);
      return;
    }
    setFieldErrors({});
    setSubmitError(null);
    setSaving(true);

    // 2. Chama a API pelo thunk. O unwrap() devolve a máquina salva ou
    //    lança o erro (a mensagem do rejectWithValue), que o catch pega
    try {
      if (machine) {
        await dispatch(
          updateMachine({ id: machine.id, ...result.data }),
        ).unwrap();
        onSaved('Máquina atualizada');
      } else {
        await dispatch(createMachine(result.data)).unwrap();
        onSaved('Máquina criada');
      }
    } catch (error) {
      setSubmitError(typeof error === 'string' ? error : 'Erro inesperado');
    } finally {
      setSaving(false);
    }
  }

  return (
    // "open" fixo: a página só desenha o diálogo quando ele está aberto.
    // Assim, cada vez que abre, o formulário começa do zero
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>{machine ? 'Editar máquina' : 'Nova máquina'}</DialogTitle>

        <DialogContent>
          {/* pt: 1 dá espaço para o rótulo do primeiro campo não ser cortado */}
          <Stack spacing={2} sx={{ pt: 1 }}>
            {submitError && <Alert severity="error">{submitError}</Alert>}

            <TextField
              label="Nome"
              autoFocus
              fullWidth
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              error={Boolean(fieldErrors.name)}
              helperText={fieldErrors.name?.[0]}
            />

            <TextField
              select
              label="Tipo"
              fullWidth
              value={values.type}
              onChange={(e) => setValues({ ...values, type: e.target.value })}
              error={Boolean(fieldErrors.type)}
              helperText={fieldErrors.type?.[0]}
            >
              {MACHINE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
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
