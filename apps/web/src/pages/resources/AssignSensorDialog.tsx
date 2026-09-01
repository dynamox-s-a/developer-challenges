import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, type FormEvent } from 'react';

import {
  SENSOR_MODELS,
  isSensorModel,
  isSensorModelAllowedForMachine,
  type MachineType,
  type SensorModel,
} from '@dynamox/domain';

import { api } from '../../api/client';

const SERIAL_MAX_LENGTH = 64;

/**
 * Associação de sensor a um ponto.
 *
 * Diálogo, e não página, porque é uma decisão de dois campos tomada com o contexto do ponto
 * inteiro à vista — sair da página para escolher um modelo seria perder o que ajuda a
 * escolher.
 *
 * A restrição "bomba não aceita TcAg/TcAs" é do domínio e vale nos dois lados: aqui ela
 * aparece antes do clique, e o backend continua sendo a barreira real.
 */
export function AssignSensorDialog({
  open,
  pointId,
  pointName,
  machineName,
  machineType,
  onClose,
  onAssigned,
}: {
  open: boolean;
  pointId: string;
  pointName: string;
  machineName: string;
  machineType: MachineType;
  onClose: () => void;
  onAssigned: () => void;
}): JSX.Element {
  const allowed = SENSOR_MODELS.filter((model) => isSensorModelAllowedForMachine(machineType, model));
  const [serialNumber, setSerialNumber] = useState('');
  const [model, setModel] = useState<SensorModel>(allowed[0] ?? 'HF+');
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const trimmed = serialNumber.trim();
  const serialError =
    trimmed === ''
      ? 'Informe o número de série do sensor.'
      : trimmed.length > SERIAL_MAX_LENGTH
        ? `O número de série deve ter no máximo ${SERIAL_MAX_LENGTH} caracteres.`
        : null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (serialError || saving) return;

    setSaving(true);
    setFailure(null);
    try {
      await api.assignSensor(pointId, trimmed, model);
      onAssigned();
    } catch (reason) {
      setFailure(reason instanceof Error ? reason.message : 'Não foi possível associar o sensor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="xs" fullWidth>
      <Stack component="form" onSubmit={submit} noValidate>
        <DialogTitle sx={{ pb: 0.5 }}>Associar sensor</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
            {machineName} · {pointName}
          </Typography>
          <DialogContentText variant="caption" component="div" sx={{ mb: 2 }}>
            Um ponto recebe no máximo um sensor. As séries temporais passam a ser gravadas na
            primeira ingestão feita com este número de série.
            {allowed.length < SENSOR_MODELS.length
              ? ' Esta é uma bomba: só modelos compatíveis aparecem na lista.'
              : ''}
          </DialogContentText>

          {failure ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {failure}
            </Alert>
          ) : null}

          <Stack spacing={2}>
            <TextField
              label="Número de série"
              value={serialNumber}
              onChange={(event) => setSerialNumber(event.target.value)}
              onBlur={() => setTouched(true)}
              error={touched && serialError !== null}
              helperText={touched && serialError ? serialError : 'Identificador único do sensor.'}
              disabled={saving}
              fullWidth
              autoFocus
              inputProps={{ 'aria-label': 'Número de série', maxLength: SERIAL_MAX_LENGTH }}
            />
            <TextField
              select
              label="Modelo"
              value={model}
              onChange={(event) => {
                if (isSensorModel(event.target.value)) setModel(event.target.value);
              }}
              disabled={saving}
              helperText={
                allowed.length < SENSOR_MODELS.length
                  ? 'Modelos TcAg e TcAs não são compatíveis com bombas.'
                  : 'Modelo do sensor instalado.'
              }
              fullWidth
              inputProps={{ 'aria-label': 'Modelo' }}
            >
              {allowed.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {saving ? 'Associando…' : 'Associar sensor'}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
