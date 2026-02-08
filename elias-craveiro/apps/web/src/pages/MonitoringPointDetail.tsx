import {
    Alert,
    Box,
    Button,
    Container,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

type Point = { timestamp: string; value: number };

export default function MonitoringPointDetail() {
    const { id } = useParams();
    const mpId = Number(id);

    const [error, setError] = useState<string | null>(null);

    const [count, setCount] = useState<number | null>(null);
    const [metrics, setMetrics] = useState<any>(null);

    const [from, setFrom] = useState<string>(''); // ISO datetime-local
    const [to, setTo] = useState<string>('');

    const [series, setSeries] = useState<Point[]>([]);
    const [loadingSeries, setLoadingSeries] = useState(false);

    const [batchSize, setBatchSize] = useState(200);
    const [baseValue, setBaseValue] = useState(10);

    function toISO(dtLocal: string) {
        // datetime-local vem sem timezone. Converte pra ISO assumindo horário local.
        if (!dtLocal) return '';

        const d = new Date(dtLocal);
        const pad = (n: number) => String(n).padStart(2, '0');

        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
            d.getHours(),
        )}:${pad(d.getMinutes())}:00.000Z`;
    }

    const qs = useMemo(() => {
        const params = new URLSearchParams();
        const f = toISO(from);
        const t = toISO(to);
        if (f) params.set('from', f);
        if (t) params.set('to', t);
        return params.toString();
    }, [from, to]);

    async function loadCount() {
        setError(null);
        try {
            const r = await api.get<{ total: number }>(
                `/monitoring-points/${mpId}/timeseries/count`,
            );
            setCount(r.total);
        } catch (e: any) {
            setError(e?.message || 'Failed to load count');
        }
    }

    async function loadMetrics() {
        setError(null);
        try {
            const url = `/monitoring-points/${mpId}/timeseries/metrics${qs ? `?${qs}` : ''}`;
            const r = await api.get(url);
            setMetrics(r);
        } catch (e: any) {
            setError(e?.message || 'Failed to load metrics');
        }
    }

    async function loadSeries() {
        setError(null);
        setLoadingSeries(true);
        try {
            const url = `/monitoring-points/${mpId}/timeseries${qs ? `?${qs}&limit=5000` : '?limit=5000'}`;
            const r = await api.get<{ points: Point[] }>(url);
            setSeries(r.points);
        } catch (e: any) {
            setError(e?.message || 'Failed to load series');
        } finally {
            setLoadingSeries(false);
        }
    }

    async function deleteSeries() {
        setError(null);
        try {
            const url = `/monitoring-points/${mpId}/timeseries${qs ? `?${qs}` : ''}`;
            await api.delete(url);
            await loadCount();
            await loadMetrics();
            await loadSeries();
        } catch (e: any) {
            setError(e?.message || 'Failed to delete series');
        }
    }

    async function sendRandomBatch() {
        setError(null);

        const n = Math.min(Math.max(batchSize, 1), 20000);
        const now = Date.now();

        // 1 ponto por segundo no passado
        const points = Array.from({ length: n }, (_, i) => {
            const ts = new Date(now - (n - 1 - i) * 1000).toISOString();
            const value =
                baseValue + Math.sin(i / 10) * 2 + (Math.random() - 0.5);
            return { timestamp: ts, value: Number(value.toFixed(3)) };
        });

        try {
            await api.post(`/monitoring-points/${mpId}/timeseries`, { points });
            await loadCount();
            await loadMetrics();
            await loadSeries();
        } catch (e: any) {
            setError(e?.message || 'Failed to send points');
        }
    }

    const chartData = useMemo(() => {
        // Recharts prefere um campo simples pro eixo X
        return series.map((p) => ({
            t: p.timestamp,
            value: p.value,
        }));
    }, [series]);

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Monitoring Point #{mpId} — Time-series
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Controls */}
            <Box
                sx={{
                    mb: 2,
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Controls
                </Typography>

                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    sx={{ mb: 2 }}
                >
                    <TextField
                        label="From (optional)"
                        type="datetime-local"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="To (optional)"
                        type="datetime-local"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />

                    <Button variant="outlined" onClick={loadCount}>
                        Count
                    </Button>
                    <Button variant="outlined" onClick={loadMetrics}>
                        Metrics
                    </Button>
                    <Button
                        variant="contained"
                        onClick={loadSeries}
                        disabled={loadingSeries}
                    >
                        {loadingSeries ? 'Loading...' : 'Load series'}
                    </Button>
                    <Button
                        color="error"
                        variant="outlined"
                        onClick={deleteSeries}
                    >
                        Delete series
                    </Button>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                        label="Random batch size"
                        type="number"
                        value={batchSize}
                        onChange={(e) => setBatchSize(Number(e.target.value))}
                        sx={{ width: 220 }}
                    />
                    <TextField
                        label="Base value"
                        type="number"
                        value={baseValue}
                        onChange={(e) => setBaseValue(Number(e.target.value))}
                        sx={{ width: 220 }}
                    />
                    <Button variant="contained" onClick={sendRandomBatch}>
                        Send random batch
                    </Button>
                </Stack>
            </Box>

            {/* Stats */}
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{ mb: 2 }}
            >
                <Box
                    sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        flex: 1,
                    }}
                >
                    <Typography variant="subtitle2">Count</Typography>
                    <Typography variant="h5">{count ?? '-'}</Typography>
                </Box>

                <Box
                    sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        flex: 2,
                    }}
                >
                    <Typography variant="subtitle2">Metrics</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {metrics ? JSON.stringify(metrics, null, 2) : '-'}
                    </Typography>
                </Box>
            </Stack>

            {/* Chart */}
            <Box
                sx={{
                    height: 420,
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Chart
                </Typography>

                {series.length === 0 ? (
                    <Alert severity="info">
                        No data loaded yet. Click “Load series”.
                    </Alert>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="t" hide />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Container>
    );
}
