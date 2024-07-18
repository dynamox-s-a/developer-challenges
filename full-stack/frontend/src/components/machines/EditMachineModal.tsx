import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Select,
    MenuItem,
    InputLabel, FormControl
} from '@mui/material';
import {createMachine, machineUpdated, updateMachine} from '@/src/store/machinesSlice';

const EditMachineModal: React.FC<{ open: boolean; handleClose: () => void; machine: any; }> = ({ open, handleClose, machine }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState(machine.name);
    const [type, setType] = useState(machine.type);

    const handleSubmit = () => {
        dispatch(updateMachine({...machine, name, type}));
        dispatch(machineUpdated({ ...machine, name, type }));
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Editar Máquina</DialogTitle>
            <DialogContent>
                <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                    <Select
                        value={type}
                        onChange={(e) => setType(e.target.value as string)}
                        label="Tipo"
                    >
                        <MenuItem value="Fan">Fan</MenuItem>
                        <MenuItem value="Pump">Pump</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleSubmit}>Salvar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditMachineModal;
