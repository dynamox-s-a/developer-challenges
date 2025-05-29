import React, { useState, useEffect } from 'react';
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
    TextField
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

interface Sensor {
    id: number;
    name?: string;
    sensorType: string;
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
        sensors: Sensor[];
        pagination: PaginationData;
    };
}

export default function SensorsPage() {
    const [sensors, setSensors] = useState<Sensor[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [sensorToDelete, setSensorToDelete] = useState<Sensor | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);    const [snackbarMessage, setSnackbarMessage] = useState('');
    
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [sensorToEdit, setSensorToEdit] = useState<Sensor | null>(null);
    const [editingName, setEditingName] = useState('');
    const [updating, setUpdating] = useState(false);

    const fetchSensors = async (currentPage: number, limit: number) => {        try {
            setLoading(true);
            const apiPage = currentPage + 1;
            const response = await axios.get<ApiResponse>(
                `http://localhost:3000/machine/sensors/paginated?page=${apiPage}&limit=${limit}`
            );

            setSensors(response.data.data.sensors);
            setPagination(response.data.data.pagination);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar os sensores');
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSensors(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const handleDeleteClick = (sensor: Sensor) => {
        setSensorToDelete(sensor);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!sensorToDelete) return;

        try {
            setDeleting(true);
            await axios.delete(`http://localhost:3000/machine/sensor/${sensorToDelete.id}`);
            
            setSnackbarMessage('Sensor deletado com sucesso!');
            setSnackbarOpen(true);
            setDeleteDialogOpen(false);            setSensorToDelete(null);
            
            fetchSensors(page, rowsPerPage);
        } catch (err) {
            console.error('Erro ao deletar sensor:', err);
            setSnackbarMessage('Erro ao deletar sensor');
            setSnackbarOpen(true);
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSensorToDelete(null);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleEditClick = (sensor: Sensor) => {
        setSensorToEdit(sensor);
        setEditingName(sensor.name || '');
        setEditDialogOpen(true);
    };

    const handleEditCancel = () => {
        setEditDialogOpen(false);
        setSensorToEdit(null);
        setEditingName('');
    };

    const handleEditConfirm = async () => {
        if (!sensorToEdit) return;

        try {
            setUpdating(true);            await axios.patch(`http://localhost:3000/machine/sensor/${sensorToEdit.id}`, {
                name: editingName,
                sensorType: sensorToEdit.sensorType
            });
            
            setSnackbarMessage('Sensor atualizado com sucesso!');
            setSnackbarOpen(true);
            setEditDialogOpen(false);
            setSensorToEdit(null);            setEditingName('');
            
            fetchSensors(page, rowsPerPage);
        } catch (err) {
            console.error('Erro ao atualizar sensor:', err);
            setSnackbarMessage('Erro ao atualizar sensor');
            setSnackbarOpen(true);
        } finally {
            setUpdating(false);
        }
    };

    const getSensorTypeColor = (type: string): 'primary' | 'secondary' | 'success' | 'default' => {
        switch (type) {
            case 'HFp':
                return 'primary';
            case 'TcAs':
                return 'secondary';
            case 'TcAg':
                return 'success';
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
            <Typography variant="h4" sx={{ mb: 3 }}>
                Lista de Sensores
            </Typography>

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="tabela de sensores">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Nome</strong></TableCell>
                            <TableCell><strong>Tipo de Sensor</strong></TableCell>
                            <TableCell><strong>Data de Criação</strong></TableCell>
                            <TableCell align="center"><strong>Ações</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sensors.map((sensor) => (
                            <TableRow
                                key={sensor.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#f9f9f9' } }}
                            >
                                <TableCell component="th" scope="row">
                                    {sensor.id}
                                </TableCell>
                                <TableCell>
                                    {sensor.name || (
                                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                            Sem nome
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={sensor.sensorType}
                                        color={getSensorTypeColor(sensor.sensorType)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {sensor.createdAt ? (
                                        new Date(sensor.createdAt).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">-</Typography>
                                    )}                                </TableCell>                                <TableCell align="center">
                                    <Tooltip title="Editar">
                                        <IconButton size="small" color="secondary" onClick={() => handleEditClick(sensor)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDeleteClick(sensor)}
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
            </TableContainer>            {pagination && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Total: {pagination.totalItems} sensores
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
                        Tem certeza que deseja excluir o sensor "{sensorToDelete?.name || 'sem nome'}" (Tipo: {sensorToDelete?.sensorType})?
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

            {/* Modal de edição de sensor */}
            <Dialog
                open={editDialogOpen}
                onClose={handleEditCancel}
                aria-labelledby="edit-dialog-title"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="edit-dialog-title">
                    Editar Sensor
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            margin="dense"
                            label="Tipo do Sensor"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={sensorToEdit?.sensorType || ''}
                            disabled
                            sx={{ mb: 2 }}
                            helperText="O tipo do sensor não pode ser alterado"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Nome do Sensor"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            disabled={updating}
                            helperText="Insira o nome do sensor"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditCancel} disabled={updating}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleEditConfirm} 
                        color="primary" 
                        disabled={updating}
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