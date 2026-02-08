import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMachinesThunk } from '../features/machines/machinesThunks';
import {
    attachSensorThunk,
    createMonitoringPointThunk,
    fetchMonitoringPointsThunk,
} from '../features/monitoringPoints/monitoringPointsThunks';
import { setTableState } from '../features/monitoringPoints/monitoringPointsSlice';
import { api } from '../api/client';

function fmtSensor(model: string | null) {
    if (!model) return '-';
    return model === 'HF_PLUS' ? 'HF+' : model;
}

type SensorModel = 'TcAg' | 'TcAs' | 'HF_PLUS';

export default function MonitoringPoints() {
    const dispatch = useAppDispatch();

    const machines = useAppSelector((s) => s.machines.items);
    const mp = useAppSelector((s) => s.monitoringPoints);

    // form create MP
    const [machineId, setMachineId] = useState<number | ''>('');
    const [mpName, setMpName] = useState('');

    // dialog attach sensor
    const [sensorOpen, setSensorOpen] = useState(false);
    const [sensorMpId, setSensorMpId] = useState<number | null>(null);
    const [sensorUid, setSensorUid] = useState('');
    const [sensorModel, setSensorModel] = useState<SensorModel>('HF_PLUS');
    const [actionError, setActionError] = useState<string | null>(null);

    // keep latest table state for callbacks inside DataGrid cells (avoid unstable columns deps)
    const tableRef = useRef({
        page: mp.page,
        pageSize: mp.pageSize,
        sort: mp.sort,
        dir: mp.dir,
    });

    useEffect(() => {
        tableRef.current = {
            page: mp.page,
            pageSize: mp.pageSize,
            sort: mp.sort,
            dir: mp.dir,
        };
    }, [mp.page, mp.pageSize, mp.sort, mp.dir]);

    // load machines once
    useEffect(() => {
        dispatch(fetchMachinesThunk());
    }, [dispatch]);

    useEffect(() => {
        dispatch(
            fetchMonitoringPointsThunk({
                page: mp.page,
                pageSize: mp.pageSize,
                sort: mp.sort,
                dir: mp.dir,
            }),
        );
    }, [dispatch, mp.page, mp.pageSize, mp.sort, mp.dir]);

    const columns = useMemo<GridColDef[]>(
        () => [
            {
                field: 'machineName',
                headerName: 'Machine Name',
                flex: 1,
                sortable: true,
            },
            {
                field: 'machineType',
                headerName: 'Machine Type',
                width: 150,
                sortable: true,
            },
            {
                field: 'monitoringPointName',
                headerName: 'Monitoring Point Name',
                flex: 1,
                sortable: true,
                renderCell: (params) => (
                    <Link
                        component={RouterLink}
                        to={`/monitoring-points/${params.row.id}`}
                    >
                        {params.value}
                    </Link>
                ),
            },
            {
                field: 'sensorModel',
                headerName: 'Sensor Model',
                width: 150,
                sortable: true,
                valueGetter: (v) => fmtSensor(v),
            },
            {
                field: 'createdAt',
                headerName: "Created At",
                sortable: true,
                width: 180,
                renderCell: (v) => new Date(v.row.createdAt).toLocaleString('pt-BR')
            },
            {
                field: 'actions',
                headerName: 'Actions',
                width: 330,
                sortable: false,
                renderCell: (params) => {
                    const row = params.row as any;

                    return (
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent="center"
                            sx={{ height: '100%' }}
                        >
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                    setActionError(null);
                                    setSensorMpId(row.id);
                                    setSensorUid('');
                                    setSensorModel('HF_PLUS');
                                    setSensorOpen(true);
                                }}
                            >
                                Attach sensor
                            </Button>

                            <Button
                                size="small"
                                color="warning"
                                variant="outlined"
                                disabled={!row.sensorModel}
                                onClick={async () => {
                                    setActionError(null);
                                    try {
                                        await api.delete<void>(
                                            `/monitoring-points/${row.id}/sensor`,
                                        );

                                        const t = tableRef.current;
                                        dispatch(
                                            fetchMonitoringPointsThunk({
                                                page: t.page,
                                                pageSize: t.pageSize,
                                                sort: t.sort,
                                                dir: t.dir,
                                            }),
                                        );
                                    } catch (e: any) {
                                        setActionError(
                                            e?.message ||
                                                'Failed to detach sensor',
                                        );
                                    }
                                }}
                            >
                                Detach
                            </Button>

                            <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={async () => {
                                    setActionError(null);
                                    try {
                                        await api.delete<void>(
                                            `/monitoring-points/${row.id}`,
                                        );

                                        const t = tableRef.current;
                                        dispatch(
                                            fetchMonitoringPointsThunk({
                                                page: t.page,
                                                pageSize: t.pageSize,
                                                sort: t.sort,
                                                dir: t.dir,
                                            }),
                                        );
                                    } catch (e: any) {
                                        setActionError(
                                            e?.message ||
                                                'Failed to delete monitoring point',
                                        );
                                    }
                                }}
                            >
                                Delete
                            </Button>
                        </Stack>
                    );
                },
            },
        ],
        [dispatch],
    );

    const sortModel = useMemo<GridSortModel>(
        () => [{ field: mp.sort, sort: mp.dir }],
        [mp.sort, mp.dir],
    );

    const paginationModel = useMemo(
        () => ({ page: mp.page - 1, pageSize: mp.pageSize }),
        [mp.page, mp.pageSize],
    );

    const machineOptions = machines.map((m: any) => ({
        id: Number(m.id),
        label: `${m.name} (${m.type})`,
    }));

    async function handleCreateMP() {
        setActionError(null);
        if (!machineId || !mpName.trim()) return;

        try {
            await dispatch(
                createMonitoringPointThunk({
                    machineId: Number(machineId),
                    name: mpName.trim(),
                }),
            ).unwrap();

            setMpName('');

            // volta pra página 1 (pra “ver” o item rápido)
            dispatch(setTableState({ page: 1 }));
            dispatch(
                fetchMonitoringPointsThunk({
                    page: 1,
                    pageSize: mp.pageSize,
                    sort: mp.sort,
                    dir: mp.dir,
                }),
            );
        } catch (e: any) {
            setActionError(e?.message || 'Failed to create monitoring point');
        }
    }

    async function handleAttachSensor() {
        setActionError(null);
        if (!sensorMpId || !sensorUid.trim()) return;

        try {
            await dispatch(
                attachSensorThunk({
                    monitoringPointId: sensorMpId,
                    uid: sensorUid.trim(),
                    model: sensorModel,
                }),
            ).unwrap();

            setSensorOpen(false);

            const t = tableRef.current;
            dispatch(
                fetchMonitoringPointsThunk({
                    page: t.page,
                    pageSize: t.pageSize,
                    sort: t.sort,
                    dir: t.dir,
                }),
            );
        } catch (e: any) {
            setActionError(e?.message || 'Failed to attach sensor');
        }
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Monitoring Points
            </Typography>

            {(mp.error || actionError) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {actionError || mp.error}
                </Alert>
            )}

            {/* Create MP */}
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
                    Create Monitoring Point
                </Typography>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <Autocomplete
                        options={machineOptions}
                        value={
                            machineOptions.find((m) => m.id === machineId) ??
                            null
                        }
                        onChange={(_e, newValue) => {
                            setMachineId(newValue ? newValue.id : '');
                        }}
                        disablePortal
                        autoHighlight
                        isOptionEqualToValue={(opt, val) => opt.id === val.id}
                        getOptionLabel={(opt) => opt.label}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Machine"
                                placeholder="Search machine..."
                                helperText={
                                    machineOptions.length === 0
                                        ? 'No machines found (create one first)'
                                        : ''
                                }
                            />
                        )}
                        sx={{ minWidth: 280 }}
                        disabled={machineOptions.length === 0}
                    />

                    <TextField
                        label="Monitoring Point Name"
                        value={mpName}
                        onChange={(e) => setMpName(e.target.value)}
                        fullWidth
                    />

                    <Button
                        variant="contained"
                        onClick={handleCreateMP}
                        disabled={!machineId || !mpName.trim()}
                    >
                        Create
                    </Button>
                </Stack>
            </Box>

            {/* DataGrid */}
            <Box sx={{ height: 560, width: '100%' }}>
                <DataGrid
                    rows={mp.items}
                    columns={columns}
                    paginationMode="server"
                    sortingMode="server"
                    rowCount={mp.total}
                    pageSizeOptions={[5]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(m) => {
                        const nextPage = m.page + 1;
                        const nextPageSize = m.pageSize;

                        if (
                            nextPage === mp.page &&
                            nextPageSize === mp.pageSize
                        )
                            return;

                        dispatch(
                            setTableState({
                                page: nextPage,
                                pageSize: nextPageSize,
                            }),
                        );
                    }}
                    sortModel={sortModel}
                    onSortModelChange={(model) => {
                        const first = model[0];
                        if (!first?.field) return;

                        const nextSort = first.field;
                        const nextDir = (first.sort || 'asc') as any;

                        if (nextSort === mp.sort && nextDir === mp.dir) return;

                        dispatch(
                            setTableState({
                                sort: nextSort,
                                dir: nextDir,
                                page: 1,
                            }),
                        );
                    }}
                    loading={mp.status === 'loading'}
                />
            </Box>

            {/* Attach Sensor Dialog */}
            <Dialog
                open={sensorOpen}
                onClose={() => setSensorOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Attach sensor</DialogTitle>
                <DialogContent sx={{ pt: 1 }}>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Sensor UID (unique)"
                            value={sensorUid}
                            onChange={(e) => setSensorUid(e.target.value)}
                            placeholder="ex: SENS-001"
                            fullWidth
                        />

                        <TextField
                            select
                            label="Sensor Model"
                            value={sensorModel}
                            onChange={(e) =>
                                setSensorModel(e.target.value as SensorModel)
                            }
                            fullWidth
                            helperText='HF+ no banco é "HF_PLUS"'
                        >
                            <MenuItem value="HF_PLUS">HF+</MenuItem>
                            <MenuItem value="TcAg">TcAg</MenuItem>
                            <MenuItem value="TcAs">TcAs</MenuItem>
                        </TextField>

                        <Alert severity="info">
                            Regra: máquinas do tipo <b>Pump</b> não aceitam{' '}
                            <b>TcAg</b> nem <b>TcAs</b>. Se você tentar, o
                            servidor vai bloquear.
                        </Alert>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSensorOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleAttachSensor}
                        disabled={!sensorUid.trim()}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
