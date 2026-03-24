import { useEffect, useMemo, useState } from "react";
import { Alert, Box, CircularProgress, Drawer, Stack, Typography, Button, Divider } from "@mui/material";
import { fetchTimeSeries, fetchTimeSeriesMetrics } from "../api/timeSeries";
import type { TimeSeriesPoint } from "../api/timeSeries";
import TimeSeriesChart from "./TimeSeriesChart";

type Props = {
  open: boolean;
  onClose: () => void;
  monitoringPointId: string | null;
  title?: string;
};

export default function MonitoringTimeSeriesDrawer({ open, onClose, monitoringPointId, title }: Props) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [items, setItems] = useState<TimeSeriesPoint[]>([]);
  const [metrics, setMetrics] = useState<{ count: number; min: number | null; max: number | null; avg: number | null } | null>(null);
  const [take] = useState(200);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!open || !monitoringPointId) return;

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const [ts, m] = await Promise.all([
          fetchTimeSeries(monitoringPointId, { take, skip }),
          fetchTimeSeriesMetrics(monitoringPointId),
        ]);
        setItems(ts.items);
        setMetrics(m);
        setTotal(ts.total);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load time-series");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, monitoringPointId, take, skip]);

  const chartData = useMemo(
    () =>
      items
        .slice()
        .reverse()
        .map((p) => ({
          timestamp: new Date(p.timestamp).toLocaleString(),
          value: p.value,
        })),
    [items]
  );

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 340, sm: 520 }, p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title ?? "Time-series"}</Typography>
          <Button onClick={onClose}>×</Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : err ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {err}
          </Alert>
        ) : (
          <>
            <TimeSeriesChart 
              monitoringPointId={monitoringPointId!} 
              title={title || "Time Series Data"} 
            />
            
            <Divider sx={{ my: 2 }} />

            <Stack spacing={2}>
              <Typography variant="subtitle2">Data Summary</Typography>
              
              {metrics && (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Typography variant="body2" color="text.secondary">
                    <strong>Total Points:</strong> {metrics.count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Min:</strong> {metrics.min?.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Max:</strong> {metrics.max?.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Avg:</strong> {metrics.avg?.toFixed(2)}
                  </Typography>
                </Stack>
              )}

              <Typography variant="body2" color="text.secondary">
                <strong>Showing:</strong> {items.length} of {total} points
              </Typography>

              {items.length < total && (
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={skip === 0}
                    onClick={() => setSkip(Math.max(0, skip - take))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={items.length < take}
                    onClick={() => setSkip(skip + take)}
                  >
                    Next
                  </Button>
                </Stack>
              )}
            </Stack>
          </>
        )}
      </Box>
    </Drawer>
  );
}
