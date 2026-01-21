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
    Card,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    MenuItem,
    CardContent
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { createMachine, deleteMachine, loadMachines, updateMachine } from '../features/machines/machinesThunks'
import type { Machine, MachineType } from '../features/machines/types'
import AddIcon from '@mui/icons-material/Add'

type MachineForm = { name: string; type: MachineType }

const emptyForm: MachineForm = { name: '', type: 'Pump' }

export default function MachinesPage() {
    const dispatch = useAppDispatch()
    const { items, status, error } = useAppSelector((s) => s.machines)

    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<Machine | null>(null)
    const [form, setForm] = useState<MachineForm>(emptyForm)
    const [localError, setLocalError] = useState<string | null>(null)

    useEffect(() => {
        dispatch(loadMachines())
    }, [dispatch])

    const title = useMemo(() => (editing ? 'Editar máquina' : 'Nova máquina'), [editing])

    const onOpenCreate = () => {
        setEditing(null)
        setForm(emptyForm)
        setLocalError(null)
        setOpen(true)
    }

    const onOpenEdit = (m: Machine) => {
        setEditing(m)
        setForm({ name: m.name, type: m.type })
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
            if (editing) {
                await dispatch(updateMachine({ id: editing.id, ...form })).unwrap()
            } else {
                await dispatch(createMachine(form)).unwrap()
            }
            onClose()
        } catch (e) {
            setLocalError(e instanceof Error ? e.message : 'Erro inesperado')
        }
    }

    const onDelete = async (m: Machine) => {
        const ok = window.confirm(`Excluir a máquina "${m.name}"?`)
        if (!ok) return
        await dispatch(deleteMachine({ id: m.id }))
    }

    const isBusy = status === 'loading'

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
                            Máquinas
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.75 }}>
                            Gerencie máquinas e tipos (Pump/Fan)
                        </Typography>
                    </Box>

                    <Box sx={{ flex: 1 }} />

                    <Button startIcon={<AddIcon />} variant="contained" onClick={onOpenCreate}>
                        Nova máquina
                    </Button>
                </Box>
            </Box>

            {(error || localError) && <Alert severity="error">{localError ?? error}</Alert>}

            <Card sx={{ overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Nome</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, width: 140 }}>
                                    Ações
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {items.length === 0 && !isBusy && (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <Box sx={{ py: 6, textAlign: 'center' }}>
                                            <Typography sx={{ fontWeight: 900, mb: 0.5 }}>
                                                Nenhuma máquina cadastrada
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                                Cadastre uma máquina para iniciar o monitoramento e vincular pontos e sensores.
                                            </Typography>
                                            <Button variant="contained" onClick={onOpenCreate}>
                                                Cadastrar máquina
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}


                            {items.map((m) => (
                                <TableRow key={m.id} hover>
                                    <TableCell>{m.name}</TableCell>
                                    <TableCell>{m.type}</TableCell>
                                    <TableCell align="right">
                                        <IconButton aria-label="edit" onClick={() => onOpenEdit(m)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton aria-label="delete" onClick={() => onDelete(m)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {isBusy && (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <Stack direction="row" alignItems="center" spacing={2}>
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

            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 800 }}>{title}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <TextField
                            label="Nome da máquina"
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            autoFocus
                            fullWidth
                        />

                        <TextField
                            select
                            label="Tipo"
                            value={form.type}
                            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as MachineType }))}
                            fullWidth
                        >
                            <MenuItem value="Pump">Pump</MenuItem>
                            <MenuItem value="Fan">Fan</MenuItem>
                        </TextField>

                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Tipos permitidos: <b>Pump</b> e <b>Fan</b>.
                        </Typography>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} disabled={isBusy}>
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={onSubmit} disabled={isBusy}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}
