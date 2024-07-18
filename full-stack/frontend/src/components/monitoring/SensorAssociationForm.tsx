"use client"

import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/src/store/store';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {associateSensor} from '@/src/store/sensorsSlice';

interface Props {
    open: boolean;
    handleClose: () => void;
}

const SensorAssociationForm: React.FC<Props> = ({open, handleClose}) => {
    const dispatch = useDispatch();
    const monitorings = useSelector((state: RootState) => state.monitoringPoints.points);

    const [selectedMonitoring, setSelectedMonitoring] = useState('');
    const [monitoringId, setMonitoringId] = useState('');
    const [modelName, setModelName] = useState('');
    const [machineType, setMachineType] = useState('');

    // UseEffect para atualizar o ID do sensor quando o monitoramento selecionado mudar
    useEffect(() => {
        const selected = monitorings.find(monitoring => monitoring.id === selectedMonitoring);
        if (selected) {
            setMonitoringId(selected.id); // Define o ID do sensor como o ID do monitoramento selecionado
            setMachineType(selected.machine.type); // Define o tipo de máquina associada ao ponto de monitoramento selecionado
        }
    }, [selectedMonitoring, monitorings]);

    const handleAssociateSensor = () => {
        if (machineType === 'Pump' && (modelName === 'TcAg' || modelName === 'TcAs')) {
            alert('Você não pode associar sensores "TcAg" ou "TcAs" a uma máquina do tipo "Pump".');
            return;
        }

        try {
            dispatch(associateSensor({modelName, machineType, monitoringId}));
            handleClose();
        } catch (err) {
            console.log(err)
        }

    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Associar Sensor</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <InputLabel>Monitoramento</InputLabel>
                    <Select
                        value={selectedMonitoring}
                        onChange={(e) => setSelectedMonitoring(e.target.value as string)}
                    >
                        {monitorings.map(monitoring => (
                            <MenuItem key={monitoring.id} value={monitoring.id}>{monitoring.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    autoFocus
                    margin="dense"
                    label="ID do monitoramento"
                    fullWidth
                    value={monitoringId}
                    disabled
                    onChange={(e) => setMonitoringId(e.target.value)}
                />
                <FormControl fullWidth>
                    <InputLabel>Modelo do Sensor</InputLabel>
                    <Select
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value as string)}
                    >
                        <MenuItem value="TcAg">TcAg</MenuItem>
                        <MenuItem value="TcAs">TcAs</MenuItem>
                        <MenuItem value="HFPlus">HF +</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleAssociateSensor} color="primary">
                    Associar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SensorAssociationForm;
