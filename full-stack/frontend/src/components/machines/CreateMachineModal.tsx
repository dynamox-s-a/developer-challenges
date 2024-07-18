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
    FormControl,
    InputLabel
} from '@mui/material';
import { createMachine, fetchMachines, machineAdded } from '@/src/store/machinesSlice'; // Ajuste o caminho conforme necessário

const CreateMachineModal: React.FC<{ open: boolean; handleClose: () => void; }> = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [type, setType] = useState('');

    const handleSubmit = async () => {
        try {
            const newMachine = { name, type };
            dispatch(createMachine(newMachine));

            handleClose();
        } catch (error) {
            console.error('Erro ao criar máquina:', error);
            // Lidar com erros de criação aqui, se necessário
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Criar Máquina</DialogTitle>
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
                <Button onClick={handleSubmit}>Criar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateMachineModal;
