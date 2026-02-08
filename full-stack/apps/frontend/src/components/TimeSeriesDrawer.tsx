import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Stack,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  CircularProgress,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fetchTimeSeries, fetchTimeSeriesMetrics, type TimeSeriesPoint, createTimeSeriesPoint } from "../api/timeSeries";

type RangePreset = "6h" | "24h" | "48h";

function toISO(d: Date) {
  return d.toISOString();
}

function rangeToFrom(preset: RangePreset): string {
  const now = new Date();
  const hours = preset === "6h" ? 6 : preset === "24h" ? 24 : 48;
  const from = new Date(now.getTime() - hours * 60 * 60 * 1000);
  return toISO(from);
}

type Props = {
  open: boolean;
  onClose: () => void;
  monitoringPointId: string | null;
  title?: string;
};

export default function TimeSeriesDrawer({ open, onClose, monitoringPointId, title }: Props) {
  const [preset, setPreset] = useState<RangePreset>("24h");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<TimeSeriesPoint[]>([]);
  const [metrics, setMetrics] = useState<{ count: number; min: number | null; max: number | null; avg: number | null } | null>(null);
  const [take] = useState(100);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);

  const from = useMemo(() => rangeToFrom(preset), [preset]);

  useEffect(() => {
    setSkip(0);
  }, [preset]);

  useEffect(() => {
    if (!open || !monitoringPointId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchTimeSeries(monitoringPointId, { from, take, skip }),
      fetchTimeSeriesMetrics(monitoringPointId, { from }),
    ])
      .then(([list, m]) => {
        if (cancelled) return;

        setPoints(
          list.items.map((p) => ({
            ...p,
            timestamp: p.timestamp,
          }))
        );
        setMetrics(m);
        setTotal(list.total);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setError(e?.response?.data?.message ?? e?.message ?? "Failed to load time-series");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, monitoringPointId, from, take, skip]);

  const handlePrev = () => {
    setSkip(Math.max(0, skip - take));
  };

  const handleNext = () => {
    setSkip(skip + take);
  };

  const canGoPrev = skip > 0;
  const canGoNext = skip + take < total;

  const handleGenerateSampleData = async () => {
    if (!monitoringPointId) return;
    
    try {
      setLoading(true);
      const now = new Date();
      const promises = [];
      
      for (let i = 0; i < 10; i++) {
        const timestamp = new Date(now.getTime() - (i * 2 * 60 * 60 * 1000));
        const value = Math.random() * 100 + 20; 
        
        promises.push(
          createTimeSeriesPoint(monitoringPointId, {
            timestamp: timestamp.toISOString(),
            value: Number(value.toFixed(2))
          })
        );
      }
      
      await Promise.all(promises);
      
      const [list, m] = await Promise.all([
        fetchTimeSeries(monitoringPointId, { from, take, skip }),
        fetchTimeSeriesMetrics(monitoringPointId, { from }),
      ]);
      
      setPoints(list.items.map((p) => ({ ...p, timestamp: p.timestamp })));
      setMetrics(m);
      setTotal(list.total);
    } catch (error: any) {
      setError(error?.response?.data?.message ?? error?.message ?? "Failed to generate sample data");
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(
    () =>
      points.map((p) => ({
        timestamp: p.timestamp,
        value: p.value,
      })),
    [points]
  );

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: "100%", sm: 520 } } }}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6">Time series</Typography>
            <Typography variant="body2" color="text.secondary">
              {title ?? monitoringPointId ?? ""}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box sx={{ mt: 2 }}>
          <ToggleButtonGroup
            value={preset}
            exclusive
            onChange={(_, v) => v && setPreset(v)}
            size="small"
          >
            <ToggleButton value="6h">Last 6h</ToggleButton>
            <ToggleButton value="24h">Last 24h</ToggleButton>
            <ToggleButton value="48h">Last 48h</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ my: 2 }} />

        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CircularProgress size={22} />
            <Typography variant="body2">Loading time-series...</Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {metrics && (
          <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
            <Chip label={`Count: ${metrics.count}`} />
            <Chip label={`Min: ${metrics.min?.toFixed(2) ?? "-"}`} />
            <Chip label={`Max: ${metrics.max?.toFixed(2) ?? "-"}`} />
            <Chip label={`Avg: ${metrics.avg?.toFixed(2) ?? "-"}`} />
          </Stack>
        )}

        {total > take && (
          <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
            <Button 
              variant="outlined" 
              size="small"
              onClick={handlePrev}
              disabled={!canGoPrev}
            >
              Prev
            </Button>
            <Typography variant="body2" color="text.secondary">
              {skip + 1}-{Math.min(skip + take, total)} of {total}
            </Typography>
            <Button 
              variant="outlined" 
              size="small"
              onClick={handleNext}
              disabled={!canGoNext}
            >
              Next
            </Button>
          </Stack>
        )}

        <Paper variant="outlined" sx={{ p: 1, height: 320 }}>
          {total === 0 && !loading ? (
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                No time-series data yet
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleGenerateSampleData}
                disabled={loading}
              >
                Generate sample datapoint
              </Button>
            </Box>
          ) : chartData.length === 0 && !loading ? (
            <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No data for selected range
              </Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(iso) => {
                    const d = new Date(iso);
                    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  }}
                  minTickGap={24}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(iso) => {
                    const d = new Date(String(iso));
                    return d.toLocaleString();
                  }}
                />
                <Line type="monotone" dataKey="value" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Paper>
      </Box>
    </Drawer>
  );
}