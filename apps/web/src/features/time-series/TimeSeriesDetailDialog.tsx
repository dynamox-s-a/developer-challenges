import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppSelector } from "../../app/hooks";

interface TimeSeriesDetailDialogProps {
  open: boolean;
  onClose: () => void;
}

function metric(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(4);
}

export function TimeSeriesDetailDialog({ open, onClose }: TimeSeriesDetailDialogProps) {
  const { detailStatus, fullSeries, metrics, error } = useAppSelector((state) => state.timeSeries);
  const chartData =
    fullSeries?.samples.filter((_, index, samples) => {
      const stride = Math.max(1, Math.ceil(samples.length / 1_000));
      return index % stride === 0 || index === samples.length - 1;
    }) ?? [];

  return (
    <Dialog fullWidth maxWidth="lg" onClose={onClose} open={open}>
      <DialogTitle>{fullSeries?.label ?? "Time-series detail"}</DialogTitle>
      <DialogContent dividers>
        {detailStatus === "loading" ? (
          <Box alignItems="center" display="flex" justifyContent="center" minHeight={360}>
            <CircularProgress />
          </Box>
        ) : null}
        {detailStatus === "failed" ? <Alert severity="error">{error}</Alert> : null}
        {detailStatus === "ready" && fullSeries && metrics ? (
          <Stack spacing={3}>
            <Grid container spacing={2}>
              {[
                ["Samples", metrics.sampleCount.toLocaleString()],
                ["Started", new Date(metrics.startedAt).toLocaleString()],
                ["Ended", new Date(metrics.endedAt).toLocaleString()],
                ["Vector magnitude RMS", metric(metrics.vectorMagnitudeRms)],
              ].map(([label, value]) => (
                <Grid item key={label} md={3} sm={6} xs={12}>
                  <Paper sx={{ height: "100%", p: 2 }} variant="outlined">
                    <Typography color="text.secondary" variant="caption">
                      {label}
                    </Typography>
                    <Typography fontWeight={700} mt={0.5}>
                      {value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Axis</TableCell>
                  <TableCell align="right">Min</TableCell>
                  <TableCell align="right">Max</TableCell>
                  <TableCell align="right">Mean</TableCell>
                  <TableCell align="right">RMS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(["x", "y", "z"] as const).map((axis) => (
                  <TableRow key={axis}>
                    <TableCell component="th" scope="row">
                      {axis.toUpperCase()}
                    </TableCell>
                    <TableCell align="right">{metric(metrics.axes[axis].min)}</TableCell>
                    <TableCell align="right">{metric(metrics.axes[axis].max)}</TableCell>
                    <TableCell align="right">{metric(metrics.axes[axis].mean)}</TableCell>
                    <TableCell align="right">{metric(metrics.axes[axis].rms)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box
              aria-label="Time-series X, Y, and Z axis chart"
              height={380}
              role="img"
              width="100%"
            >
              <ResponsiveContainer height="100%" width="100%">
                <LineChart data={chartData} margin={{ bottom: 8, left: 8, right: 20, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    minTickGap={36}
                    tickFormatter={(value: string) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis width={64} />
                  <Tooltip labelFormatter={(value) => new Date(String(value)).toLocaleString()} />
                  <Legend />
                  <Line
                    dataKey="x"
                    dot={false}
                    isAnimationActive={false}
                    stroke="#0f4c5c"
                    type="monotone"
                  />
                  <Line
                    dataKey="y"
                    dot={false}
                    isAnimationActive={false}
                    stroke="#e36414"
                    type="monotone"
                  />
                  <Line
                    dataKey="z"
                    dot={false}
                    isAnimationActive={false}
                    stroke="#6a4c93"
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            {fullSeries.samples.length > 1_000 ? (
              <Typography color="text.secondary" variant="caption">
                The chart displays an evenly sampled preview of the full{" "}
                {fullSeries.samples.length.toLocaleString()}-sample series.
              </Typography>
            ) : null}
          </Stack>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
