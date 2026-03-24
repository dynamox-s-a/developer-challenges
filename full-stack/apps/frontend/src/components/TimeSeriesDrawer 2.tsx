import { useEffect, useMemo, useState } from "react";
import { Alert, Box, CircularProgress, Divider, Drawer, Stack, Typography, Button } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fetchTimeSeries, fetchTimeSeriesMetrics } from "../api/timeSeries";
import type { TimeSeriesPoint } from "../api/timeSeries";

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
          x: new Date(p.timestamp).toLocaleString(),
          value: p.value,
        })),
    [items]
  );

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 340, sm: 520 }, p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title ?? "Time-series"}</Typography>
          <Button
            size="small"
            onClick={() => {
              if (monitoringPointId) {
                setSkip(0);
                // Trigger refresh by updating skip
              }
            }}
          >
            Refresh
          </Button>
        </Stack>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
          Monitoring Point: {monitoringPointId}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

        {loading ? (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading time-series…</Typography>
          </Stack>
        ) : (
          <>
            {metrics && (
              <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
                <Typography variant="body2"><b>Count:</b> {metrics.count}</Typography>
                <Typography variant="body2"><b>Min:</b> {metrics.min?.toFixed(2) ?? "-"}</Typography>
                <Typography variant="body2"><b>Max:</b> {metrics.max?.toFixed(2) ?? "-"}</Typography>
                <Typography variant="body2"><b>Avg:</b> {metrics.avg?.toFixed(2) ?? "-"}</Typography>
              </Stack>
            )}

            <Box sx={{ height: 320, width: "100%", minHeight: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="x" hide />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {items.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                No time-series data found for this monitoring point.
              </Alert>
            )}

            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Latest points
            </Typography>

            <Box sx={{ maxHeight: 260, overflow: "auto" }}>
              {items.map((p) => (
                <Box key={p.id} sx={{ py: 1 }}>
                  <Typography variant="body2">{new Date(p.timestamp).toLocaleString()}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    value: {p.value}
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              ))}
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center" justifyContent="space-between">
              <Button
                disabled={skip <= 0 || loading}
                onClick={() => setSkip(Math.max(0, skip - take))}
              >
                Prev
              </Button>

              <Typography variant="caption">
                {total === 0 ? "0" : `${skip + 1}-${Math.min(skip + take, total)}`} of {total}
              </Typography>

              <Button
                disabled={skip + take >= total || loading}
                onClick={() => setSkip(skip + take)}
              >
                Next
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Drawer>
  );
}
