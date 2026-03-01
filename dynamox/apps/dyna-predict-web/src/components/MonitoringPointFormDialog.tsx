import { useEffect } from 'react';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import type { MonitoringPointWithMachineAndSensor } from '@dynamox/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMachines } from '../store/features/machines/machine.slice';
import {
  createMonitoringPoint,
  fetchMonitoringPoints,
  updateMonitoringPoint,
} from '../store/features/monitoring-points/monitoring-points.slice';
import type { MonitoringPointsQuery } from '../api/monitoring-points';
import FormDialog from './FormDialog';
import { notify } from '../utils/notifications';

type SensorModel = 'HFPlus' | 'TcAg' | 'TcAs';

const SENSOR_OPTIONS_FAN: { value: SensorModel | ''; label: string }[] = [
  { value: '', label: 'Sem sensor' },
  { value: 'HFPlus', label: 'HF+' },
  { value: 'TcAg', label: 'TcAg' },
  { value: 'TcAs', label: 'TcAs' },
];

const SENSOR_OPTIONS_PUMP: { value: SensorModel | ''; label: string }[] = [
  { value: '', label: 'Sem sensor' },
  { value: 'HFPlus', label: 'HF+' },
];

interface FormValues {
  machineUuid: string;
  name: string;
  sensorModel: SensorModel | '';
}

interface MonitoringPointFormDialogProps {
  open: boolean;
  onClose: () => void;
  point?: MonitoringPointWithMachineAndSensor;
  fetchParams: MonitoringPointsQuery;
}

function MonitoringPointFormDialog({
  open,
  onClose,
  point,
  fetchParams,
}: MonitoringPointFormDialogProps) {
  const dispatch = useAppDispatch();
  const machines = useAppSelector((state) => state.machines.machines);
  const isEditing = !!point;

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { machineUuid: '', name: '', sensorModel: '' },
  });

  const selectedMachineUuid = watch('machineUuid');
  const selectedMachine = isEditing
    ? point.machine
    : machines.find((m) => m.uuid === selectedMachineUuid);
  const isPump = selectedMachine?.type === 'Pump';
  const sensorOptions = isPump ? SENSOR_OPTIONS_PUMP : SENSOR_OPTIONS_FAN;

  useEffect(() => {
    if (isPump) {
      const current = watch('sensorModel');
      if (current === 'TcAg' || current === 'TcAs') {
        setValue('sensorModel', '');
      }
    }
  }, [isPump, setValue, watch]);

  useEffect(() => {
    if (!open) return;
    dispatch(fetchMachines());
    if (point) {
      reset({
        machineUuid: point.machine.uuid,
        name: point.name,
        sensorModel: (point.sensor?.model as SensorModel) ?? '',
      });
    } else {
      reset({ machineUuid: '', name: '', sensorModel: '' });
    }
  }, [open, point, reset, dispatch]);

  const onSubmit = async (values: FormValues) => {
    const sensorModel = values.sensorModel || undefined;
    try {
      if (isEditing) {
        await dispatch(
          updateMonitoringPoint({
            uuid: point.uuid,
            data: { name: values.name, sensorModel },
          })
        ).unwrap();
      } else {
        await dispatch(
          createMonitoringPoint({
            machineUuid: values.machineUuid,
            name: values.name,
            sensorModel,
          })
        ).unwrap();
      }
      await dispatch(fetchMonitoringPoints(fetchParams));
      notify(
        isEditing
          ? 'Ponto de monitoramento atualizado com sucesso!'
          : 'Ponto de monitoramento criado com sucesso!',
        'success'
      );
      onClose();
    } catch (error) {
      const message =
        typeof error === 'string' ? error : 'Erro ao salvar ponto de monitoramento.';
      notify(message, 'error');
    }
  };

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Ponto de Monitoramento' : 'Novo Ponto de Monitoramento'}
    >
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2} sx={{ mt: 1 }}>
        {isEditing ? (
          <TextField
            label="Máquina"
            value={`${point.machine.name} (${point.machine.type})`}
            fullWidth
            disabled
          />
        ) : (
          <Controller
            name="machineUuid"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Máquina"
                select
                fullWidth
                error={!!errors.machineUuid}
                helperText={errors.machineUuid ? 'Selecione uma máquina' : undefined}
              >
                {machines.map((m) => (
                  <MenuItem key={m.uuid} value={m.uuid}>
                    {m.name} ({m.type})
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        )}

        <TextField
          label="Nome do Ponto"
          placeholder="ex: Temperatura do Rolamento"
          fullWidth
          {...register('name', { required: true, minLength: 1 })}
          error={!!errors.name}
          helperText={errors.name ? 'Nome é obrigatório' : undefined}
        />

        <Controller
          name="sensorModel"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Modelo do Sensor" select fullWidth>
              {sensorOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {isPump && (
          <Typography variant="caption" color="text.secondary">
            Sensores TcAg e TcAs não são compatíveis com máquinas do tipo Pump.
          </Typography>
        )}

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

export default MonitoringPointFormDialog;
