import type { Machine, TimeSeriesSample } from "@dyn/contracts";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearMachinePoints, fetchMachinePoints } from "../monitoring/monitoringSlice";
import { CSV_TEMPLATE_URL, CsvParseError, parseSensorCsv } from "./csv";

interface UploadTimeSeriesDialogProps {
  open: boolean;
  machines: Machine[];
  pending: boolean;
  submitError: string | null;
  onClose: () => void;
  onSubmit: (input: {
    monitoringPointId: string;
    label?: string;
    samples: TimeSeriesSample[];
  }) => void;
}

export function UploadTimeSeriesDialog({
  open,
  machines,
  pending,
  submitError,
  onClose,
  onSubmit,
}: UploadTimeSeriesDialogProps) {
  const dispatch = useAppDispatch();
  const { error, machinePoints, machinePointsStatus } = useAppSelector((state) => state.monitoring);
  const [machineId, setMachineId] = useState("");
  const [monitoringPointId, setMonitoringPointId] = useState("");
  const [label, setLabel] = useState("");
  const [samples, setSamples] = useState<TimeSeriesSample[]>([]);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);

  const compatiblePoints = useMemo(
    () => machinePoints.filter((point) => point.sensor !== null),
    [machinePoints]
  );

  useEffect(() => {
    if (open) {
      setMachineId("");
      setMonitoringPointId("");
      setLabel("");
      setSamples([]);
      setFileName("");
      setFileError(null);
      dispatch(clearMachinePoints());
    }
  }, [dispatch, open]);

  function handleMachineChange(nextMachineId: string) {
    setMachineId(nextMachineId);
    setMonitoringPointId("");
    dispatch(clearMachinePoints());
    if (nextMachineId) {
      void dispatch(fetchMachinePoints(nextMachineId));
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    setFileName(file.name);
    setFileError(null);
    setSamples([]);
    try {
      const csv = await file.text();
      setSamples(parseSensorCsv(csv));
    } catch (error) {
      setFileError(
        error instanceof CsvParseError ? error.message : "The selected CSV could not be read."
      );
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      monitoringPointId,
      ...(label.trim() ? { label: label.trim() } : {}),
      samples,
    });
  }

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>Upload time series</DialogTitle>
      <DialogContent>
        {submitError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        ) : null}
        <Stack component="form" id="upload-series-form" onSubmit={handleSubmit} spacing={2} pt={1}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="upload-machine-label">Machine</InputLabel>
              <Select
                label="Machine"
                labelId="upload-machine-label"
                onChange={(event) => handleMachineChange(event.target.value)}
                value={machineId}
              >
                {machines.map((machine) => (
                  <MenuItem key={machine.id} value={machine.id}>
                    {machine.name} ({machine.type})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              disabled={!machineId || machinePointsStatus === "loading"}
              fullWidth
              size="small"
            >
              <InputLabel id="upload-point-label">Monitoring point</InputLabel>
              <Select
                label="Monitoring point"
                labelId="upload-point-label"
                onChange={(event) => setMonitoringPointId(event.target.value)}
                value={monitoringPointId}
              >
                {compatiblePoints.map((point) => (
                  <MenuItem key={point.id} value={point.id}>
                    {point.name} — {point.sensor?.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          {machinePointsStatus === "loading" ? (
            <Box alignItems="center" display="flex" gap={1}>
              <CircularProgress size={18} />
              <Typography color="text.secondary" variant="body2">
                Loading monitoring points…
              </Typography>
            </Box>
          ) : null}
          {machinePointsStatus === "failed" ? (
            <Alert severity="error">{error ?? "Unable to load monitoring points."}</Alert>
          ) : null}
          {machineId && machinePointsStatus === "ready" && compatiblePoints.length === 0 ? (
            <Alert severity="warning">
              This machine has no monitoring point with an associated sensor.
            </Alert>
          ) : null}
          <TextField
            inputProps={{ maxLength: 120 }}
            label="Label (optional)"
            onChange={(event) => setLabel(event.target.value)}
            value={label}
          />
          <Stack alignItems={{ sm: "center" }} direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button component="label" startIcon={<UploadFileOutlinedIcon />} variant="outlined">
              Select CSV
              <input
                accept=".csv,text/csv"
                hidden
                onChange={(event) => void handleFileChange(event)}
                type="file"
              />
            </Button>
            <Button
              component="a"
              download="time-series-template.csv"
              href={CSV_TEMPLATE_URL}
              startIcon={<DownloadOutlinedIcon />}
            >
              Download CSV template
            </Button>
            <Typography color="text.secondary" variant="body2">
              {fileName || "timestamp, x, y, z — up to 10,000 samples"}
            </Typography>
          </Stack>
          {fileError ? <Alert severity="error">{fileError}</Alert> : null}
          {samples.length > 0 ? (
            <Box>
              <Alert severity="success" sx={{ mb: 1.5 }}>
                {samples.length.toLocaleString()} samples validated. Previewing the first{" "}
                {Math.min(10, samples.length)}.
              </Alert>
              <TableContainer sx={{ maxHeight: 320 }}>
                <Table aria-label="CSV sample preview" size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell align="right">X</TableCell>
                      <TableCell align="right">Y</TableCell>
                      <TableCell align="right">Z</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {samples.slice(0, 10).map((sample) => (
                      <TableRow key={sample.timestamp}>
                        <TableCell>{sample.timestamp}</TableCell>
                        <TableCell align="right">{sample.x}</TableCell>
                        <TableCell align="right">{sample.y}</TableCell>
                        <TableCell align="right">{sample.z}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={pending} onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={pending || !monitoringPointId || samples.length === 0}
          form="upload-series-form"
          type="submit"
          variant="contained"
        >
          {pending ? <CircularProgress color="inherit" size={20} /> : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
