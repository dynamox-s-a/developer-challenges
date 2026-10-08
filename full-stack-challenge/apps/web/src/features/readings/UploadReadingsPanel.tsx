import type { CreateReadingsResultDto } from '@dynapredict/shared-types';
import UploadFile from '@mui/icons-material/UploadFile';
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { type ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { formatNumber, pluralize } from '../../utils/format';
import { type ParsedReadings, parseReadingsFile } from './parseReadingsFile';
import {
  selectSensorReadings,
  type UploadRejection,
  uploadReadings,
} from './readingsSlice';

interface UploadReadingsPanelProps {
  sensorId: string;
  onUploaded: (fileName: string, result: CreateReadingsResultDto) => void;
}

interface SelectedFile {
  name: string;
  parsed: ParsedReadings;
}

/** Larger files would be slow to parse and to send in 1000-reading batches. */
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

/**
 * Pick a CSV or JSON file, check it locally, then send it in batches with a
 * progress bar. Nothing is sent while the file has invalid lines.
 */
export function UploadReadingsPanel({
  sensorId,
  onUploaded,
}: UploadReadingsPanelProps) {
  const dispatch = useAppDispatch();
  const progress = useAppSelector(
    (state) => selectSensorReadings(state, sensorId).upload,
  );
  const [file, setFile] = useState<SelectedFile | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [failure, setFailure] = useState<UploadRejection | null>(null);
  const uploading = progress !== null;

  const choose = async (event: ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0];
    // Allow picking the same file again after fixing it.
    event.target.value = '';
    if (!picked) return;
    setFailure(null);
    setFile(null);
    if (picked.size > MAX_FILE_BYTES) {
      setFileError(
        `${picked.name} is larger than ${MAX_FILE_BYTES / 1024 / 1024} MB. Split it into smaller files.`,
      );
      return;
    }
    setFileError(null);
    setFile({
      name: picked.name,
      parsed: parseReadingsFile(picked.name, await picked.text()),
    });
  };

  const upload = async () => {
    if (!file) return;
    setFailure(null);
    try {
      const result = await dispatch(
        uploadReadings({ sensorId, readings: file.parsed.readings }),
      ).unwrap();
      onUploaded(file.name, result);
      setFile(null);
    } catch (rejected) {
      setFailure(rejected as UploadRejection);
    }
  };

  const ready =
    file !== null &&
    file.parsed.invalidCount === 0 &&
    file.parsed.readings.length > 0;

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        CSV with <code>timestamp,value</code> columns (or <code>;</code> with a
        decimal comma), or JSON{' '}
        <code>
          [{'{'}"timestamp", "value"{'}'}]
        </code>
        . Timestamps without a time zone are read in your local time. Readings
        already stored for the same instant are skipped, so sending a file twice
        is safe.
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ alignItems: { sm: 'center' } }}
      >
        <Button
          component="label"
          variant="outlined"
          startIcon={<UploadFile />}
          disabled={uploading}
          sx={{ minHeight: 44 }}
        >
          Choose file
          <Box
            component="input"
            type="file"
            accept=".csv,.json,text/csv,application/json"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              void choose(event)
            }
            sx={{
              // Visually hidden but still in the accessibility tree.
              clip: 'rect(0 0 0 0)',
              clipPath: 'inset(50%)',
              height: 1,
              overflow: 'hidden',
              position: 'absolute',
              whiteSpace: 'nowrap',
              width: 1,
            }}
          />
        </Button>
        <Button
          variant="contained"
          onClick={() => void upload()}
          disabled={!ready || uploading}
          sx={{ minHeight: 44 }}
        >
          {ready
            ? `Upload ${pluralize(file.parsed.readings.length, 'reading')}`
            : 'Upload'}
        </Button>
      </Stack>

      {fileError && <Alert severity="error">{fileError}</Alert>}

      {file && file.parsed.invalidCount === 0 && !uploading && (
        <Typography variant="body2" role="status">
          {file.name}: {pluralize(file.parsed.readings.length, 'reading')} ready
          to upload.
        </Typography>
      )}

      {file && file.parsed.invalidCount > 0 && (
        <Alert severity="error">
          {file.name} has{' '}
          {pluralize(
            file.parsed.invalidCount,
            'invalid entry',
            'invalid entries',
          )}
          . Fix them and choose the file again:
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            {file.parsed.errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </Box>
          {file.parsed.invalidCount > file.parsed.errors.length &&
            `…and ${file.parsed.invalidCount - file.parsed.errors.length} more.`}
        </Alert>
      )}

      {progress && (
        <Box>
          <LinearProgress
            variant="determinate"
            value={(progress.sent / progress.total) * 100}
            aria-label="Upload progress"
            aria-valuetext={`${formatNumber(progress.sent)} of ${formatNumber(progress.total)} readings sent`}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Sending {formatNumber(progress.sent)} of{' '}
            {formatNumber(progress.total)} readings…
          </Typography>
        </Box>
      )}

      {failure && (
        <Alert severity="error">
          The upload stopped after {formatNumber(failure.sent)} readings:{' '}
          {failure.message}. Readings sent before that were stored; choosing the
          file again and uploading it is safe.
        </Alert>
      )}
    </Stack>
  );
}
