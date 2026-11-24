import { useState, type FormEvent } from 'react';
import { z } from 'zod';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import {
  isSensorModelAllowed,
  SENSOR_MODELS,
  SENSOR_MODELS_NOT_ALLOWED,
  SERIAL_NUMBER_PREFIXES,
  sensorModelSchema,
  sensorSchema,
  type SensorInput,
} from '@dynapredict/shared';
import { useAppDispatch } from '../../app/hooks';
import {
  removeSensor,
  setSensor,
  type MonitoringPoint,
} from './monitoring-points.slice';

// O que está no formulário. O modelo começa vazio ('') num ponto sem sensor
type FormValues = { model: string; serialNumber: string };

// Ex.: { serialNumber: ['Use o formato DyL4.01.A0000'] }
type FieldErrors = Partial<Record<keyof SensorInput, string[]>>;

type SensorDialogProps = {
  // O ponto cujo sensor está sendo colocado, trocado ou tirado
  point: MonitoringPoint;
  onClose: () => void;
  // Chamado depois de salvar ou remover, com a mensagem de sucesso
  onSaved: (message: string) => void;
};

export function SensorDialog({ point, onClose, onSaved }: SensorDialogProps) {
  const dispatch = useAppDispatch();
  const { machine, sensor } = point;

  // O ponto já tem sensor? O formulário começa com ele
  const [values, setValues] = useState<FormValues>({
    model: sensor?.model ?? '',
    serialNumber: sensor?.serialNumber ?? '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Os modelos que a máquina deste ponto não aceita (Pump: TcAg e TcAs).
  // A dica explica por que essas opções aparecem desabilitadas
  const notAllowed = SENSOR_MODELS_NOT_ALLOWED[machine.type];
  const modelHint =
    notAllowed.length > 0
      ? `Máquinas do tipo ${machine.type} não aceitam ${notAllowed.join(' e ')}`
      : undefined;

  // O exemplo do número de série muda com o modelo (TcAg: DyL1...)
  const chosenModel = sensorModelSchema.safeParse(values.model);
  const prefix = chosenModel.success
    ? SERIAL_NUMBER_PREFIXES[chosenModel.data]
    : 'DyL4';

  // Salvar e remover usam o mesmo caminho: chama a API e avisa a página
  async function run(action: () => Promise<unknown>, message: string) {
    setSubmitError(null);
    setSaving(true);
    try {
      await action();
      onSaved(message);
    } catch (error) {
      setSubmitError(typeof error === 'string' ? error : 'Erro inesperado');
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Formato do número e prefixo certo para o modelo: o mesmo schema da API
    const result = sensorSchema.safeParse(values);
    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors);
      return;
    }
    setFieldErrors({});

    await run(
      () => dispatch(setSensor({ pointId: point.id, ...result.data })).unwrap(),
      'Sensor salvo',
    );
  }

  async function handleRemove() {
    await run(
      () => dispatch(removeSensor(point.id)).unwrap(),
      'Sensor removido',
    );
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>Sensor do ponto {point.name}</DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Máquina: {machine.name} ({machine.type})
          </DialogContentText>

          <Stack spacing={2}>
            {submitError && <Alert severity="error">{submitError}</Alert>}

            <TextField
              select
              label="Modelo"
              autoFocus
              fullWidth
              value={values.model}
              onChange={(e) => setValues({ ...values, model: e.target.value })}
              error={Boolean(fieldErrors.model)}
              helperText={fieldErrors.model?.[0] ?? modelHint}
            >
              {SENSOR_MODELS.map((model) => (
                <MenuItem
                  key={model}
                  value={model}
                  disabled={!isSensorModelAllowed(machine.type, model)}
                >
                  {model}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Número de série"
              fullWidth
              value={values.serialNumber}
              onChange={(e) =>
                setValues({ ...values, serialNumber: e.target.value })
              }
              error={Boolean(fieldErrors.serialNumber)}
              helperText={
                fieldErrors.serialNumber?.[0] ?? `Ex.: ${prefix}.01.A0000`
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          {/* Só aparece se o ponto já tem sensor. mr: 'auto' empurra os
              outros botões para a direita */}
          {sensor && (
            <Button
              color="error"
              onClick={handleRemove}
              disabled={saving}
              sx={{ mr: 'auto' }}
            >
              Remover sensor
            </Button>
          )}
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
