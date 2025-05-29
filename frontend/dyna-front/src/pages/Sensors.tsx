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
    Checkbox
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

interface Sensor {
    id: number;
    name?: string;
    sensorType: string;
    createdAt?: string;
    updatedAt?: string;
    isLinked?: boolean;
    linkedMachines?: { id: number; name: string }[];
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
    // Função para obter headers com token de autenticação
    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const [sensors, setSensors] = useState<Sensor[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [sensorToDelete, setSensorToDelete] = useState<Sensor | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false); const [snackbarMessage, setSnackbarMessage] = useState('');

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [sensorToEdit, setSensorToEdit] = useState<Sensor | null>(null);
    const [editingName, setEditingName] = useState('');
    const [updating, setUpdating] = useState(false);    const fetchSensors = useCallback(async (currentPage: number, limit: number) => {
        try {
            setLoading(true);
            const apiPage = currentPage + 1;
            const response = await axios.get<ApiResponse>(
                `http://localhost:3000/machine/sensors/paginated?page=${apiPage}&limit=${limit}`,
                { headers: getAuthHeaders() }
            );

            setSensors(response.data.data.sensors);
            setPagination(response.data.data.pagination);
            setError(null);
        } catch (err) {
            setError('Error loading sensors');
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSensors(page, rowsPerPage);
    }, [page, rowsPerPage, fetchSensors]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    }; const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const handleDeleteClick = (sensor: Sensor) => {
        setSensorToDelete(sensor);
        setDeleteDialogOpen(true);
    };    const handleDeleteConfirm = async () => {
        if (!sensorToDelete) return;

        try {
            setDeleting(true);
            await axios.delete(`http://localhost:3000/machine/sensor/${sensorToDelete.id}`, {
                headers: getAuthHeaders()
            });

            setSnackbarMessage('Sensor deleted successfully!');
            setSnackbarOpen(true);
            setDeleteDialogOpen(false); setSensorToDelete(null);

            fetchSensors(page, rowsPerPage);
        } catch (err) {
            console.error('Error deleting sensor:', err);
            setSnackbarMessage('EError deleting sensor');
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
        if (!sensorToEdit) return;        try {
            setUpdating(true); 
            await axios.patch(`http://localhost:3000/machine/sensor/${sensorToEdit.id}`, {
                name: editingName,
                sensorType: sensorToEdit.sensorType
            }, {
                headers: getAuthHeaders()
            });

            setSnackbarMessage('Sensor updated successfully!');
            setSnackbarOpen(true);
            setEditDialogOpen(false);
            setSensorToEdit(null); setEditingName('');

            fetchSensors(page, rowsPerPage);
        } catch (err) {
            console.error('Error updating sensor:', err);
            setSnackbarMessage('Error updating sensor');
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
                Sensor's List
            </Typography>

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="tabela de sensores">
                    <TableHead>                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell><strong>ID</strong></TableCell>
                        <TableCell><strong>Name</strong></TableCell>
                        <TableCell><strong>Type of Sensor</strong></TableCell>
                        <TableCell align="center"><strong>Link</strong></TableCell>
                        <TableCell align="center"><strong>Actions</strong></TableCell>
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
                                            Unnamed
                                        </Typography>
                                    )}
                                </TableCell>                                <TableCell>
                                    <Chip
                                        label={sensor.sensorType}
                                        color={getSensorTypeColor(sensor.sensorType)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title={sensor.isLinked ? `Linked to machines: ${sensor.linkedMachines?.map(m => m.name).join(', ')}` : 'Not linked'}>
                                        <Checkbox
                                            checked={sensor.isLinked || false}
                                            disabled
                                            color="primary"
                                        />
                                    </Tooltip>
                                </TableCell><TableCell align="center">
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
                        labelRowsPerPage="Rows per page:"
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
                        }
                    />
                )}
            </TableContainer>            {pagination && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Total: {pagination.totalItems} sensors
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Page {pagination.currentPage} of {pagination.totalPages}
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
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the sensor? "{sensorToDelete?.name || 'Unnamed'}" (Type: {sensorToDelete?.sensorType})?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} disabled={deleting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        disabled={deleting}
                        variant="contained"
                    >
                        {deleting ? 'Removing...' : 'Remove'}
                    </Button>
                </DialogActions>
            </Dialog>

            
            <Dialog
                open={editDialogOpen}
                onClose={handleEditCancel}
                aria-labelledby="edit-dialog-title"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="edit-dialog-title">
                    Edit Sensor
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
                            helperText="Sensor type cannot be changed"
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
                            helperText="Enter sensor name (optional)"
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
                        {updating ? 'Salving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </Box>
    );
}