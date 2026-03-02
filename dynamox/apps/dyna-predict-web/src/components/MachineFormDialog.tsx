import { useEffect } from 'react';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import type { CreateMachineRequest, MachinesListResponse } from '@dynamox/types';
import { useAppDispatch } from '../store/hooks';
import { createMachine, updateMachine } from '../store/features/machines/machine.slice';
import FormDialog from './FormDialog';
import { notify } from '../utils/notifications';

type Machine = MachinesListResponse['machines'][number];

interface MachineFormDialogProps {
  open: boolean;
  onClose: () => void;
  machine?: Machine;
}

function MachineFormDialog({ open, onClose, machine }: MachineFormDialogProps) {
  const dispatch = useAppDispatch();
  const isEditing = !!machine;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateMachineRequest>({
    defaultValues: { name: '', type: 'Pump' },
  });

  useEffect(() => {
    if (open) {
      reset(machine ? { name: machine.name, type: machine.type } : { name: '', type: 'Pump' });
    }
  }, [open, machine, reset]);

  const onSubmit = async (data: CreateMachineRequest) => {
    try {
      if (isEditing) {
        await dispatch(updateMachine({ uuid: machine.uuid, data })).unwrap();
      } else {
        await dispatch(createMachine(data)).unwrap();
      }
      notify(isEditing ? 'Máquina atualizada com sucesso!' : 'Máquina criada com sucesso!', 'success');
      onClose();
    } catch (error) {
      const message = typeof error === 'string' ? error : 'Erro ao salvar máquina. Tente novamente.';
      notify(message, 'error');
    }
  };

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Máquina' : 'Nova Máquina'}
    >
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2} sx={{ mt: 1 }}>
        <TextField
          label="Nome"
          placeholder="Nome da máquina"
          fullWidth
          {...register('name', { required: 'Nome é obrigatório', minLength: { value: 1, message: 'Nome é obrigatório' } })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Tipo"
          select
          fullWidth
          defaultValue="Pump"
          {...register('type', { required: 'Selecione um tipo válido' })}
          error={!!errors.type}
          helperText={errors.type?.message}
        >
          <MenuItem value="Pump">Pump</MenuItem>
          <MenuItem value="Fan">Fan</MenuItem>
        </TextField>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disableElevation
          disabled={isSubmitting}
        >
          {isEditing ? 'Salvar' : 'Criar'}
        </Button>
      </Stack>
    </FormDialog>
  );
}

export default MachineFormDialog;
