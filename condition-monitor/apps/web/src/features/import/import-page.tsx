import { MAX_READINGS_PER_SUBMISSION, MAX_UPLOAD_BYTES } from '@condition-monitor/shared';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useEffect, useState, type ChangeEvent } from 'react';
import { FailureAlert } from '../../components/failure-alert';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { importCleared, importFile, type ImportError } from './import-slice';

const number = (value: number) => value.toLocaleString('en-US');
const megabytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

function describe(error: ImportError): string {
  const where = error.line === null ? '' : `Line ${error.line}, `;
  return `${where}${error.field}: ${error.message}`;
}

/**
 * Uploads a CSV file of readings (assumptions C11, C12). The file is stored at once, with
 * no preview: it is stored whole or not at all (C4, E2). The answer says what each sensor
 * received, or which lines were refused and why.
 */
export function ImportPage() {
  const dispatch = useAppDispatch();
  const { status, report, failure } = useAppSelector((state) => state.import);
  const [file, setFile] = useState<File | null>(null);
  const tooLarge = file !== null && file.size > MAX_UPLOAD_BYTES;

  // A previous answer describes a previous file; leaving the screen forgets it.
  useEffect(
    () => () => {
      dispatch(importCleared());
    },
    [dispatch],
  );

  const choose = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
    dispatch(importCleared());
    // Lets the same file be chosen again after it was corrected on disk.
    event.target.value = '';
  };

  return (
    <>
      <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
        CSV import
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography gutterBottom>
          One reading per line, UTF-8, with a header naming the columns{' '}
          <code>serial_number, timestamp, quantity, axis, value</code> in any order. Use commas
          between columns and a dot as decimal mark. Timestamps need an offset, such as{' '}
          <code>2026-09-29T10:00:00Z</code>; temperature leaves the axis empty.
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Up to {number(MAX_READINGS_PER_SUBMISSION)} readings and {megabytes(MAX_UPLOAD_BYTES)} per
          file. Readings sent again are counted and ignored.{' '}
          <Link href="/samples/readings-example.csv" download>
            Download an example file
          </Link>{' '}
          (one day of sensor <code>DX-000001</code>: install it at a monitoring point first).
        </Typography>
      </Paper>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }} alignItems="center">
        <Button variant="outlined" component="label" disabled={status === 'uploading'}>
          Choose file
          <input hidden type="file" accept=".csv,text/csv" onChange={choose} />
        </Button>
        <Typography sx={{ flexGrow: 1, overflowWrap: 'anywhere' }} color="text.secondary">
          {file ? `${file.name} (${megabytes(file.size)})` : 'No file chosen'}
        </Typography>
        <Button
          variant="contained"
          disabled={!file || tooLarge || status === 'uploading'}
          onClick={() => file && void dispatch(importFile(file))}
        >
          {status === 'uploading' ? 'Importing…' : 'Import'}
        </Button>
      </Stack>

      {tooLarge && (
        <Alert severity="error" sx={{ mb: 2 }}>
          The file has {megabytes(file.size)}; at most {megabytes(MAX_UPLOAD_BYTES)} are accepted.
          Split it into smaller files.
        </Alert>
      )}

      {failure && <FailureAlert message={failure.message} reasons={failure.errors.map(describe)} />}

      {report && (
        <Box>
          {report.totals.readingsInserted === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              Nothing new: all {number(report.totals.readingsRepeated)} readings were already
              stored.
            </Alert>
          ) : (
            <Alert severity="success" sx={{ mb: 2 }}>
              {number(report.totals.readingsInserted)} readings stored
              {report.totals.seriesCreated > 0 &&
                `, in ${number(report.totals.seriesCreated)} new time-series`}
              {report.totals.readingsRepeated > 0 &&
                `; ${number(report.totals.readingsRepeated)} already stored were ignored`}
              .
            </Alert>
          )}
          <TableContainer component={Paper}>
            <Table aria-label="Import report" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Sensor</TableCell>
                  <TableCell align="right">Series created</TableCell>
                  <TableCell align="right">Readings stored</TableCell>
                  <TableCell align="right">Already stored</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.sensors.map((sensor) => (
                  <TableRow key={sensor.serialNumber}>
                    <TableCell>{sensor.serialNumber}</TableCell>
                    <TableCell align="right">{number(sensor.seriesCreated)}</TableCell>
                    <TableCell align="right">{number(sensor.readingsInserted)}</TableCell>
                    <TableCell align="right">{number(sensor.readingsRepeated)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
}
