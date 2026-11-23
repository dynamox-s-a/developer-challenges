import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  MAX_TIME_SERIES_SAMPLES,
  timeSeriesSchema,
  type TimeSeriesUpload,
} from '@dynapredict/shared';
import { useAppDispatch } from '../../app/hooks';
import { parseSamplesCsv } from './parse-samples-csv';
import { uploadTimeSeries } from './time-series.slice';

type FormValues = { name: string; unit: string };

// Uma mensagem por campo. O "file" junta os erros do arquivo e das medições
type FormErrors = { name?: string; unit?: string; file?: string };

type UploadTimeSeriesDialogProps = {
  pointId: string;
  onClose: () => void;
  // Chamado depois de enviar, com a mensagem de sucesso
  onUploaded: (message: string) => void;
};

export function UploadTimeSeriesDialog({
  pointId,
  onClose,
  onUploaded,
}: UploadTimeSeriesDialogProps) {
  const dispatch = useAppDispatch();

  const [values, setValues] = useState<FormValues>({ name: '', unit: '' });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    let samples: TimeSeriesUpload['samples'] = [];
    let lines: number[] = [];

    if (!file) {
      nextErrors.file = 'Escolha um arquivo CSV';
    } else {
      const parsed = parseSamplesCsv(await file.text());
      if (parsed.ok) {
        ({ samples, lines } = parsed);
      } else {
        nextErrors.file = parsed.error;
      }
    }

    // O mesmo schema da API: o erro aparece aqui, antes de enviar
    const upload = { ...values, samples };
    const result = timeSeriesSchema.safeParse(upload);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const [field, index] = issue.path;
        if (field === 'name' || field === 'unit') {
          nextErrors[field] ??= issue.message;
        } else if (field === 'samples') {
          // Erro numa medição: diz em que linha do arquivo ela está
          nextErrors.file ??=
            typeof index === 'number'
              ? `Linha ${lines[index]}: ${issue.message}`
              : issue.message;
        }
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    setSubmitError(null);
    setSending(true);

    try {
      await dispatch(uploadTimeSeries({ pointId, ...upload })).unwrap();
      onUploaded('Série enviada');
    } catch (error) {
      setSubmitError(typeof error === 'string' ? error : 'Erro inesperado');
    } finally {
      setSending(false);
    }
  }

  return (
    // Como nos outros diálogos: a página só o desenha quando está aberto
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>Enviar série temporal</DialogTitle>

        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>
              Um arquivo CSV com uma medição por linha, no formato{' '}
              <strong>instante,valor</strong>. O instante precisa ter fuso, ex.:
              2026-11-22T10:00:00Z. Até{' '}
              {MAX_TIME_SERIES_SAMPLES.toLocaleString('pt-BR')} medições.{' '}
              {/* O arquivo fica em apps/web/public */}
              <Link href="/exemplo-serie.csv" download>
                Baixar um exemplo
              </Link>
            </DialogContentText>

            {submitError && <Alert severity="error">{submitError}</Alert>}

            <TextField
              label="Nome da série"
              autoFocus
              fullWidth
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              error={Boolean(errors.name)}
              helperText={errors.name ?? 'Ex.: Velocidade RMS ou Temperatura'}
            />

            <TextField
              label="Unidade (opcional)"
              fullWidth
              value={values.unit}
              onChange={(e) => setValues({ ...values, unit: e.target.value })}
              error={Boolean(errors.unit)}
              helperText={errors.unit ?? 'Ex.: mm/s ou °C'}
            />

            <Box>
              {/* O botão é um <label>: clicar nele abre a escolha de arquivo */}
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
              >
                Escolher arquivo
                <input
                  hidden
                  type="file"
                  accept=".csv,text/csv"
                  aria-label="Arquivo CSV"
                  onChange={handleFileChange}
                />
              </Button>
              <Typography
                variant="body2"
                color={errors.file ? 'error' : 'text.secondary'}
                sx={{ mt: 1 }}
              >
                {errors.file ?? file?.name ?? 'Nenhum arquivo escolhido'}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={sending}>
            {sending ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
