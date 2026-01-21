import { useEffect, useMemo, useState } from 'react'
import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material'
import TableSortLabel from '@mui/material/TableSortLabel'
import Pagination from '@mui/material/Pagination'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { loadMachines } from '../features/machines/machinesThunks'
import { loadMonitoringPoints } from '../features/monitoring/monitoringThunks'

import type { SortDir } from '../utils/sorting'
import { sortByKey } from '../utils/sorting'
import { paginate, pageCount } from '../utils/pagination'

type SensorRow = {
    id: string
    model: string
    machineName: string
    machineType: string
    monitoringPointName: string
}

export default function SensorsPage() {
    const dispatch = useAppDispatch()

    const PAGE_SIZE = 5

    const machines = useAppSelector((s) => s.machines.items)
    const monitoring = useAppSelector((s) => s.monitoring.items)

    const machinesStatus = useAppSelector((s) => s.machines.status)
    const monitoringStatus = useAppSelector((s) => s.monitoring.status)

    const machinesError = useAppSelector((s) => s.machines.error)
    const monitoringError = useAppSelector((s) => s.monitoring.error)

    const isBusy = machinesStatus === 'loading' || monitoringStatus === 'loading'
    const error = machinesError || monitoringError

    useEffect(() => {
        // garante dados mesmo se entrar direto na rota /sensors
        dispatch(loadMachines())
        dispatch(loadMonitoringPoints())
    }, [dispatch])

    const rows: SensorRow[] = useMemo(() => {
        return monitoring
            .filter((p) => !!p.sensor)
            .map((p) => {
                const m = machines.find((x) => x.id === p.machineId)
                return {
                    id: p.sensor!.id,
                    model: p.sensor!.model,
                    machineName: m?.name ?? '(máquina removida)',
                    machineType: m?.type ?? '-',
                    monitoringPointName: p.name
                }
            })
    }, [monitoring, machines])

    type SortKey = keyof SensorRow
    const [sortKey, setSortKey] = useState<SortKey>('id')
    const [sortDir, setSortDir] = useState<SortDir>('asc')
    const [page, setPage] = useState(0)

    const sortedRows = useMemo(() => sortByKey(rows, sortKey, sortDir), [rows, sortKey, sortDir])
    const totalPages = useMemo(() => pageCount(sortedRows.length, PAGE_SIZE), [sortedRows.length])

    useEffect(() => {
        if (page > totalPages - 1) setPage(Math.max(0, totalPages - 1))
    }, [page, totalPages])

    const pageRows = useMemo(() => paginate(sortedRows, page, PAGE_SIZE), [sortedRows, page])

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        else {
            setSortKey(key)
            setSortDir('asc')
        }
        setPage(0)
    }

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
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    Sensores
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.75 }}>
                    Visualize os sensores associados aos pontos de monitoramento.
                </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Card sx={{ overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    <TableSortLabel
                                        active={sortKey === 'id'}
                                        direction={sortKey === 'id' ? sortDir : 'asc'}
                                        onClick={() => toggleSort('id')}
                                    >
                                        Sensor ID
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell sx={{ fontWeight: 700 }}>
                                    <TableSortLabel
                                        active={sortKey === 'model'}
                                        direction={sortKey === 'model' ? sortDir : 'asc'}
                                        onClick={() => toggleSort('model')}
                                    >
                                        Modelo
                                    </TableSortLabel>
                                </TableCell>

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
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.length === 0 && !isBusy && (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Box sx={{ py: 6, textAlign: 'center' }}>
                                            <Typography sx={{ fontWeight: 900, mb: 0.5 }}>
                                                Nenhum sensor cadastrado
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Associe um sensor a um ponto de monitoramento para ele aparecer aqui.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}

                            {pageRows.map((r) => (
                                <TableRow key={`${r.id}-${r.monitoringPointName}`} hover>
                                    <TableCell>{r.id}</TableCell>
                                    <TableCell>{r.model}</TableCell>
                                    <TableCell>{r.machineName}</TableCell>
                                    <TableCell>{r.machineType}</TableCell>
                                    <TableCell>{r.monitoringPointName}</TableCell>
                                </TableRow>
                            ))}

                            {isBusy && (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1.5 }}>
                                            <CircularProgress size={18} />
                                            <Typography>Carregando...</Typography>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
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
        </Stack>
    )
}
