import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Chip,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Snackbar,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    FormHelperText,
    Grid
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

interface Sensor {
    id: number;
    name?: string;
    sensorType: string;
}

interface Machine {
    id: number;
    name: string;
    typeOfMachine: string;
    statusMachine: string;
    pointmonitoring1?: Sensor;
    pointmonitoring2?: Sensor;
    createdAt?: string;
    updatedAt?: string;
}

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface ApiResponse {
    message: string;
    data: {
        machines: Machine[];
        pagination: PaginationData;
    };
}

export default function Machines() {
    const [machines, setMachines] = useState<Machine[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);    const [rowsPerPage, setRowsPerPage] = useState(5);
    
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [machineToDelete, setMachineToDelete] = useState<Machine | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);    const [snackbarMessage, setSnackbarMessage] = useState('');
    
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [machineToEdit, setMachineToEdit] = useState<Machine | null>(null);
    const [editingName, setEditingName] = useState('');
    const [availableSensors, setAvailableSensors] = useState<Sensor[]>([]);
    const [selectedSensor1, setSelectedSensor1] = useState<number | ''>('');
    const [selectedSensor2, setSelectedSensor2] = useState<number | ''>('');    const [updating, setUpdating] = useState(false);
    
    const [showOnlyActive, setShowOnlyActive] = useState(false);

    const fetchMachines = useCallback(async (currentPage: number, limit: number) => {        try {
            setLoading(true);
            const apiPage = currentPage + 1;
            const response = await axios.get<ApiResponse>(
                `http://localhost:3000/machine/paginated?page=${apiPage}&limit=${limit}`
            );

            let filteredMachines = response.data.data.machines;
            
            if (showOnlyActive) {
                filteredMachines = filteredMachines.filter(machine => machine.statusMachine === 'ON');
            }

            setMachines(filteredMachines);
            setPagination(response.data.data.pagination);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar as máquinas');
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    }, [showOnlyActive]);

    const fetchAvailableSensors = async () => {
        try {
            const response = await axios.get('http://localhost:3000/machine/sensors');
            setAvailableSensors(response.data.sensors || []);
        } catch (err) {
            console.error('Erro ao carregar sensores:', err);
        }
    };

    useEffect(() => {
        fetchMachines(page, rowsPerPage);
        fetchAvailableSensors();
    }, [page, rowsPerPage, fetchMachines]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const handleDeleteClick = (machine: Machine) => {
        setMachineToDelete(machine);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!machineToDelete) return;

        try {
            setDeleting(true);
            await axios.delete(`http://localhost:3000/machine/${machineToDelete.id}`);
            
            setSnackbarMessage('Máquina deletada com sucesso!');            setSnackbarOpen(true);
            setDeleteDialogOpen(false);
            setMachineToDelete(null);
            
            fetchMachines(page, rowsPerPage);
        } catch (err) {
            console.error('Erro ao deletar máquina:', err);
            setSnackbarMessage('Erro ao deletar máquina');
            setSnackbarOpen(true);
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setMachineToDelete(null);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);    };

    const handleEditClick = (machine: Machine) => {
        setMachineToEdit(machine);
        setEditingName(machine.name);
        setSelectedSensor1(machine.pointmonitoring1?.id || '');
        setSelectedSensor2(machine.pointmonitoring2?.id || '');
        setEditDialogOpen(true);
    };

    const handleEditCancel = () => {
        setEditDialogOpen(false);
        setMachineToEdit(null);
        setEditingName('');
        setSelectedSensor1('');
        setSelectedSensor2('');
    };

    const handleEditConfirm = async () => {
        if (!machineToEdit) return;

        try {
            setUpdating(true);
              if (editingName !== machineToEdit.name) {
                await axios.patch(`http://localhost:3000/machine/name/${machineToEdit.id}`, {
                    name: editingName
                });
            }

            const sensor1Changed = selectedSensor1 !== (machineToEdit.pointmonitoring1?.id || '');
            const sensor2Changed = selectedSensor2 !== (machineToEdit.pointmonitoring2?.id || '');
            
            if (sensor1Changed || sensor2Changed) {
                await axios.patch(`http://localhost:3000/machine/link/${machineToEdit.id}`, {
                    id_pointmonitoring1: selectedSensor1 || null,
                    id_pointmonitoring2: selectedSensor2 || null
                });
            }
            
            setSnackbarMessage('Máquina atualizada com sucesso!');
            setSnackbarOpen(true);
            setEditDialogOpen(false);
            setMachineToEdit(null);
            setEditingName('');
            setSelectedSensor1('');            setSelectedSensor2('');
            
            fetchMachines(page, rowsPerPage);
        } catch (err) {
            console.error('Erro ao atualizar máquina:', err);
            setSnackbarMessage('Erro ao atualizar máquina');
            setSnackbarOpen(true);
        } finally {
            setUpdating(false);
        }
    };

    const getCompatibleSensors = (machineType: string) => {
        if (machineType === 'PUMP') {
            return availableSensors.filter(sensor => sensor.sensorType === 'HFp');
        } else if (machineType === 'FAN') {
            return availableSensors.filter(sensor => 
                sensor.sensorType === 'TcAs' || sensor.sensorType === 'TcAg'
            );
        }
        return [];
    };

    const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
        switch (status) {
            case 'RUNNING':
                return 'success';
            case 'ALERTING':
                return 'warning';
            case 'STOPPED':
                return 'error';
            default:
                return 'default';
        }
    };

    const getTypeColor = (type: string): 'primary' | 'secondary' | 'default' => {
        switch (type) {
            case 'PUMP':
                return 'primary';
            case 'FAN':
                return 'secondary';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 2.5 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Lista de Máquinas
                </Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={showOnlyActive}
                            onChange={(e) => setShowOnlyActive(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Mostrar apenas máquinas ativas"
                />
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="tabela de máquinas">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Nome</strong></TableCell>
                            <TableCell><strong>Tipo</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Sensor 1</strong></TableCell>
                            <TableCell><strong>Sensor 2</strong></TableCell>
                            <TableCell align="center"><strong>Ações</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {machines.map((machine) => (
                            <TableRow
                                key={machine.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#f9f9f9' } }}
                            >
                                <TableCell component="th" scope="row">
                                    {machine.id}
                                </TableCell>
                                <TableCell>{machine.name}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={machine.typeOfMachine}
                                        color={getTypeColor(machine.typeOfMachine)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={machine.statusMachine}
                                        color={getStatusColor(machine.statusMachine)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {machine.pointmonitoring1 ? (
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                {machine.pointmonitoring1.name || 'Sem nome'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {machine.pointmonitoring1.sensorType}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">-</Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {machine.pointmonitoring2 ? (
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                {machine.pointmonitoring2.name || 'Sem nome'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {machine.pointmonitoring2.sensorType}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">-</Typography>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Editar">
                                        <IconButton size="small" color="secondary" onClick={() => handleEditClick(machine)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDeleteClick(machine)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {pagination && (
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={pagination.totalItems}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Linhas por página:"
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
                        }
                    />
                )}
            </TableContainer>

            {pagination && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Total: {pagination.totalItems} máquinas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Página {pagination.currentPage} de {pagination.totalPages}
                    </Typography>
                </Box>
            )}

            {/* Modal de confirmação de delete */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirmar Exclusão
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir a máquina "{machineToDelete?.name}"?
                        Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} disabled={deleting}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        disabled={deleting}
                        variant="contained"
                    >
                        {deleting ? 'Excluindo...' : 'Excluir'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal de edição de máquina */}
            <Dialog
                open={editDialogOpen}
                onClose={handleEditCancel}
                aria-labelledby="edit-dialog-title"
                maxWidth="md"
                fullWidth
            >
                <DialogTitle id="edit-dialog-title">
                    Editar Máquina
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Edite as informações da máquina. O ID e tipo não podem ser alterados.
                    </DialogContentText>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                disabled
                                label="ID"
                                value={machineToEdit?.id || ''}
                                fullWidth
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                disabled
                                label="Tipo da Máquina"
                                value={machineToEdit?.typeOfMachine || ''}
                                fullWidth
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Nome"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                fullWidth
                                variant="outlined"
                                size="small"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel>Sensor 1</InputLabel>
                                <Select
                                    value={selectedSensor1}
                                    onChange={(e) => setSelectedSensor1(e.target.value as number | '')}
                                    label="Sensor 1"
                                >
                                    <MenuItem value="">
                                        <em>Nenhum sensor</em>
                                    </MenuItem>
                                    {getCompatibleSensors(machineToEdit?.typeOfMachine || '').map((sensor) => (
                                        <MenuItem key={sensor.id} value={sensor.id}>
                                            {sensor.name || `Sensor ${sensor.id}`} ({sensor.sensorType})
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>
                                    {machineToEdit?.typeOfMachine === 'PUMP' 
                                        ? 'Apenas sensores HFp são compatíveis com bombas'
                                        : 'Apenas sensores TcAs e TcAg são compatíveis com ventiladores'
                                    }
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel>Sensor 2</InputLabel>
                                <Select
                                    value={selectedSensor2}
                                    onChange={(e) => setSelectedSensor2(e.target.value as number | '')}
                                    label="Sensor 2"
                                >
                                    <MenuItem value="">
                                        <em>Nenhum sensor</em>
                                    </MenuItem>
                                    {getCompatibleSensors(machineToEdit?.typeOfMachine || '').map((sensor) => (
                                        <MenuItem key={sensor.id} value={sensor.id}>
                                            {sensor.name || `Sensor ${sensor.id}`} ({sensor.sensorType})
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>
                                    {machineToEdit?.typeOfMachine === 'PUMP' 
                                        ? 'Apenas sensores HFp são compatíveis com bombas'
                                        : 'Apenas sensores TcAs e TcAg são compatíveis com ventiladores'
                                    }
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditCancel} disabled={updating}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleEditConfirm} 
                        color="primary" 
                        disabled={updating || !editingName.trim()}
                        variant="contained"
                    >
                        {updating ? 'Salvando...' : 'Salvar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para feedback */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </Box>
    );
}
