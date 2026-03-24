import { useEffect, useMemo, useState } from 'react'
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Card,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from 'react-router-dom'

import type { MonitoringPoint, SensorModel, MonitoringPointRow } from '../features/monitoring/types'
import {
    createMonitoringPoint,
    deleteMonitoringPoint,
    loadMonitoringPoints,
    updateMonitoringPoint,
    setMonitoringSensor
} from '../features/monitoring/monitoringThunks'
import TableSortLabel from '@mui/material/TableSortLabel'
import Pagination from '@mui/material/Pagination'

import type { SortDir } from '../utils/sorting'
import { sortByKey } from '../utils/sorting'
import { paginate, pageCount } from '../utils/pagination'

import { loadMachines } from '../features/machines/machinesThunks'
import { useAppDispatch, useAppSelector } from '../app/hooks'

type FormState = {
    machineId: string
    name: string
    sensorId: string
    sensorModel: SensorModel | ''
}
const emptyForm: FormState = { machineId: '', name: '', sensorId: '', sensorModel: '' }

export default function MonitoringPointsPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const PAGE_SIZE = 5

    type SortKey = keyof MonitoringPointRow

    const [sortKey, setSortKey] = useState<SortKey>('machineName')
    const [sortDir, setSortDir] = useState<SortDir>('asc')
    const [page, setPage] = useState(0)

    const machines = useAppSelector((s) => s.machines.items)
    const monitoring = useAppSelector((s) => s.monitoring.items)
    const status = useAppSelector((s) => s.monitoring.status)
    const error = useAppSelector((s) => s.monitoring.error)

    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<MonitoringPoint | null>(null)
    const [form, setForm] = useState<FormState>(emptyForm)
    const [localError, setLocalError] = useState<string | null>(null)

    // -----------------------------
    // NOVO: filtros
    // -----------------------------
    const [searchPoint, setSearchPoint] = useState('')
    const [sensorModelFilter, setSensorModelFilter] = useState<SensorModel | 'NO_SENSOR' | ''>('')
    // '' = todos, 'NO_SENSOR' = sem sensor, ou SensorModel

    useEffect(() => {
        dispatch(loadMachines())
        dispatch(loadMonitoringPoints())
    }, [dispatch])

    const isBusy = status === 'loading'

    const rows: MonitoringPointRow[] = useMemo(() => {
        return monitoring.map((p) => {
            const m = machines.find((x) => x.id === p.machineId)
            return {
                id: p.id,
                machineId: p.machineId,
                machineName: m?.name ?? '(máquina removida)',
                machineType: m?.type ?? 'Pump',
                monitoringPointName: p.name,
                sensorModel: p.sensor?.model ?? null
            }
        })
    }, [monitoring, machines])

    // opções do select: modelos existentes nos dados (+ "Sem sensor")
    const sensorModelOptions = useMemo(() => {
        const set = new Set<SensorModel>()
        rows.forEach((r) => {
            if (r.sensorModel) set.add(r.sensorModel)
        })
        return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)))
    }, [rows])

    // aplica filtros
    const filteredRows = useMemo(() => {
        const q = searchPoint.trim().toLowerCase()

        return rows.filter((r) => {
            const matchPoint = q ? r.monitoringPointName.toLowerCase().includes(q) : true

            const matchSensor =
                sensorModelFilter === ''
                    ? true
                    : sensorModelFilter === 'NO_SENSOR'
                        ? r.sensorModel === null
                        : r.sensorModel === sensorModelFilter

            return matchPoint && matchSensor
        })
    }, [rows, searchPoint, sensorModelFilter])

    // ordena + pagina em cima do FILTRADO
    const sortedRows = useMemo(() => {
        return sortByKey(filteredRows, sortKey, sortDir)
    }, [filteredRows, sortKey, sortDir])

    const totalPages = useMemo(() => pageCount(sortedRows.length, PAGE_SIZE), [sortedRows.length])

    useEffect(() => {
        if (page > totalPages - 1) setPage(Math.max(0, totalPages - 1))
    }, [page, totalPages])

    // resetar página quando muda filtro
    useEffect(() => {
        setPage(0)
    }, [searchPoint, sensorModelFilter])

    const pageRows = useMemo(() => {
        return paginate(sortedRows, page, PAGE_SIZE)
    }, [sortedRows, page])

    const title = editing ? 'Editar ponto de monitoramento' : 'Novo ponto de monitoramento'

    const onOpenCreate = () => {
        setEditing(null)
        setForm({
            machineId: machines[0]?.id ?? '',
            name: '',
            sensorId: '',
            sensorModel: ''
        })
        setLocalError(null)
        setOpen(true)
    }

    const onOpenEdit = (p: MonitoringPoint) => {
        setEditing(p)
        setForm({
            machineId: p.machineId,
            name: p.name,
            sensorId: p.sensor?.id ?? '',
            sensorModel: p.sensor?.model ?? ''
        })
        setLocalError(null)
        setOpen(true)
    }

    const onClose = () => {
        setOpen(false)
        setEditing(null)
        setForm(emptyForm)
        setLocalError(null)
    }

    const onSubmit = async () => {
        setLocalError(null)
        try {
            let saved: MonitoringPoint

            if (editing) {
                saved = await dispatch(
                    updateMonitoringPoint({ id: editing.id, machineId: form.machineId, name: form.name })
                ).unwrap()
            } else {
                saved = await dispatch(createMonitoringPoint({ machineId: form.machineId, name: form.name })).unwrap()
            }

            // sensor opcional
            const hasSensor = form.sensorModel && form.sensorId.trim()
            if (hasSensor) {
                await dispatch(
                    setMonitoringSensor({
                        monitoringPointId: saved.id,
                        sensor: { id: form.sensorId.trim(), model: form.sensorModel as SensorModel }
                    })
                ).unwrap()
            } else {
                await dispatch(setMonitoringSensor({ monitoringPointId: saved.id, sensor: null })).unwrap()
            }

            onClose()
        } catch (e) {
            console.error('onSubmit error:', e)
            setLocalError(e instanceof Error ? e.message : JSON.stringify(e))
        }
    }

    const onDelete = async (p: MonitoringPoint) => {
        const ok = window.confirm(`Excluir o ponto "${p.name}"?`)
        if (!ok) return
        await dispatch(deleteMonitoringPoint({ id: p.id }))
    }

    const noMachines = machines.length === 0

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortKey(key)
            setSortDir('asc')
        }
        setPage(0)
    }

    const hasAnyRows = rows.length > 0
    const hasFilters = searchPoint.trim() !== '' || sensorModelFilter !== ''

    return (
        <Stack spacing={2}>
            <Box
                sx={{
                    p: 2.5,
                    borderRadius: 3,
                    background: 'linear-gradient(180deg, rgba(15,23,42,0.98), rgba(15,23,42,0.90))',
                    border: '1px solid rgba(148, 163, 184, 0.14)',
                    mb: 1
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 900 }}>
                            Pontos de Monitoramento
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.75 }}>
                            Gerencie os pontos e sensores vinculados às máquinas.
                        </Typography>
                    </Box>

                    <Box sx={{ flex: 1 }} />

                    <Button variant="contained" onClick={onOpenCreate} disabled={noMachines}>
                        Novo ponto
                    </Button>
                </Box>
            </Box>

            {noMachines && (
                <Alert
                    severity="warning"
                    action={
                        <Button color="inherit" size="small" onClick={() => navigate('/machines')}>
                            Criar máquina
                        </Button>
                    }
                >
                    Você precisa criar pelo menos uma máquina antes de cadastrar pontos de monitoramento.
                </Alert>
            )}

            {(error || localError) && <Alert severity="error">{localError ?? error}</Alert>}

            {/* NOVO: Barra de filtros */}
            <Card>
                <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="Pesquisar por nome do ponto"
                        size="small"
                        value={searchPoint}
                        onChange={(e) => setSearchPoint(e.target.value)}
                        sx={{ minWidth: 280, flex: '1 1 280px' }}
                        placeholder="Ex: Entrada, Ponto 01..."
                    />

                    <TextField
                        label="Tipo de sensor"
                        size="small"
                        select
                        value={sensorModelFilter}
                        onChange={(e) => setSensorModelFilter(e.target.value as any)}
                        sx={{ minWidth: 220 }}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="NO_SENSOR">Sem sensor</MenuItem>
                        {sensorModelOptions.map((opt) => (
                            <MenuItem key={String(opt)} value={opt}>
                                {String(opt)}
                            </MenuItem>
                        ))}
                    </TextField>

                    {(hasFilters) && (
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setSearchPoint('')
                                setSensorModelFilter('')
                            }}
                        >
                            Limpar
                        </Button>
                    )}
                </Box>
            </Card>

            <Card sx={{ overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>
                                <TableSortLabel
                                    active={sortKey === 'machineName'}
                                    direction={sortKey === 'machineName' ? sortDir : 'asc'}
                                    onClick={() => toggleSort('machineName')}
                                >
                                    Máquina
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                <TableSortLabel
                                    active={sortKey === 'machineType'}
                                    direction={sortKey === 'machineType' ? sortDir : 'asc'}
                                    onClick={() => toggleSort('machineType')}
                                >
                                    Tipo
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                <TableSortLabel
                                    active={sortKey === 'monitoringPointName'}
                                    direction={sortKey === 'monitoringPointName' ? sortDir : 'asc'}
                                    onClick={() => toggleSort('monitoringPointName')}
                                >
                                    Ponto
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                <TableSortLabel
                                    active={sortKey === 'sensorModel'}
                                    direction={sortKey === 'sensorModel' ? sortDir : 'asc'}
                                    onClick={() => toggleSort('sensorModel')}
                                >
                                    Sensor
                                </TableSortLabel>
                            </TableCell>

                            <TableCell align="right" sx={{ fontWeight: 700, width: 140 }}>
                                Ações
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!hasAnyRows && !isBusy && (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <Typography sx={{ opacity: 0.8 }}>
                                        Nenhum ponto cadastrado. Clique em <b>Novo ponto</b> para adicionar.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        {hasAnyRows && sortedRows.length === 0 && !isBusy && (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <Typography sx={{ opacity: 0.8 }}>
                                        Nenhum resultado. {hasFilters ? 'Tente ajustar/rem_toggleSortover os filtros.' : ''}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        {pageRows.map((r) => {
                            const original = monitoring.find((p) => p.id === r.id)
                            return (
                                <TableRow key={r.id} hover>
                                    <TableCell>{r.machineName}</TableCell>
                                    <TableCell>{r.machineType}</TableCell>
                                    <TableCell>{r.monitoringPointName}</TableCell>
                                    <TableCell>{r.sensorModel ?? '-'}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            aria-label="edit"
                                            onClick={() => original && onOpenEdit(original)}
                                            disabled={!original}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => original && onDelete(original)}
                                            disabled={!original}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}

                        {isBusy && (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <CircularProgress size={18} />
                                        <Typography>Carregando...</Typography>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {sortedRows.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                    <Pagination
                        count={totalPages}
                        page={page + 1}
                        onChange={(_, value) => setPage(value - 1)}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            )}

            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 800 }}>{title}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <TextField
                            select
                            label="Máquina"
                            value={form.machineId}
                            onChange={(e) => setForm((p) => ({ ...p, machineId: e.target.value }))}
                            fullWidth
                            disabled={noMachines}
                        >
                            {machines.map((m) => (
                                <MenuItem key={m.id} value={m.id}>
                                    {m.name} ({m.type})
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Nome do ponto"
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            fullWidth
                        />

                        <TextField
                            select
                            label="Modelo do sensor (opcional)"
                            value={form.sensorModel}
                            onChange={(e) => setForm((p) => ({ ...p, sensorModel: e.target.value as any }))}
                            fullWidth
                        >
                            <MenuItem value="">Sem sensor</MenuItem>
                            <MenuItem value="TcAg">TcAg</MenuItem>
                            <MenuItem value="TcAs">TcAs</MenuItem>
                            <MenuItem value="HF+">HF+</MenuItem>
                        </TextField>

                        <TextField
                            label="ID do sensor (opcional)"
                            value={form.sensorId}
                            onChange={(e) => setForm((p) => ({ ...p, sensorId: e.target.value }))}
                            fullWidth
                            disabled={!form.sensorModel}
                        />

                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            Regras: <b>TcAg</b> e <b>TcAs</b> não podem ser usados em máquinas do tipo <b>Pump</b>. O ID do sensor deve ser único.
                        </Typography>

                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            Sensor será associado no próximo passo (gestão de sensores).
                        </Typography>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} disabled={isBusy}>
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={onSubmit} disabled={isBusy || noMachines}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}
