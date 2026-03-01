import { useEffect } from 'react';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { typeboxResolver } from '@hookform/resolvers/typebox';
import { CreateMachineRequestSchema } from '@dynamox/types';
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
    resolver: typeboxResolver(CreateMachineRequestSchema) as unknown as Resolver<CreateMachineRequest>,
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
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name ? 'Nome é obrigatório' : undefined}
        />
        <TextField
          label="Tipo"
          select
          fullWidth
          defaultValue="Pump"
          {...register('type')}
          error={!!errors.type}
          helperText={errors.type ? 'Selecione um tipo válido' : undefined}
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
