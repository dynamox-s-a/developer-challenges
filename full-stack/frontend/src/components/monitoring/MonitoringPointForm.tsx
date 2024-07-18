import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    CircularProgress
} from '@mui/material';
import {RootState} from '@/src/store/store';
import {createMonitoringPoint} from '@/src/store/monitoringPointsSlice';
import {fetchMachines} from "@/src/store/machinesSlice";

interface Props {
    open: boolean;
    handleClose: () => void;
}

const MonitoringPointForm: React.FC<Props> = ({open, handleClose}) => {
    const dispatch = useDispatch();
    const machines = useSelector((state: RootState) => state.machines.machines); // Supondo que você tenha um slice para máquinas no Redux
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [machineId, setMachineId] = useState('');

    useEffect(() => {
        dispatch(fetchMachines());
    }, [dispatch]);


    const handleAddPoint = () => {
        try {
            dispatch(createMonitoringPoint({name, machineId}));
            handleClose();
        } catch (error){
            console.error('Erro ao criar máquina:', error);
        }

    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Adicionar Ponto de Monitoramento</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nome do Ponto de Monitoramento"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {loading ? (
                    <CircularProgress size={24}/>
                ) : (
                    <Select
                        value={machineId}
                        onChange={(e) => setMachineId(e.target.value as string)}
                        fullWidth
                        displayEmpty
                        margin="dense"
                        placeholder="Selecione a Máquina"
                    >
                        {machines?.map(machine => (
                            <MenuItem key={machine.id} value={machine.id}>
                                {machine.name}
                            </MenuItem>
                        ))}
                    </Select>
                )}
                {/* Campo para selecionar o tipo de máquina, se necessário */}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleAddPoint} color="primary">
                    Adicionar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MonitoringPointForm;
