import { Box, Button, MenuItem, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    addMachine,
    updateMachine,
    type MachineType,
    type Machine,
} from './MachinesSlice';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import type { RootState } from '../../app/store';

interface Props {
    selectedMachine: Machine | null;
    onClear: () => void;
}

export default function MachineForm({ selectedMachine, onClear }: Props) {
    const dispatch = useDispatch();
    const machines = useSelector((state: RootState) => state.machines.list);

    const [name, setName] = useState('');
    const [type, setType] = useState<MachineType>('Pump');

    useEffect(() => {
        if (selectedMachine) {
            setName(selectedMachine.name);
            setType(selectedMachine.type);
        }
    }, [selectedMachine]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedName = name.trim();
        if (!trimmedName) {
            alert('The hostname must not be empty');
            return;
        }

        const nameExists = machines.some(
        (m) =>
            m.name.toLowerCase() === trimmedName.toLowerCase() &&
            m.id !== selectedMachine?.id
        );

        if (nameExists) {
            alert('There is already a machine with that name');
            return;
        }

        if (selectedMachine) {
            dispatch(updateMachine({ id: selectedMachine.id, name: trimmedName, type }));
        } else {
            dispatch(addMachine({ id: uuidv4(), name: trimmedName, type }));
        }

        setName('');
        setType('Pump');
        onClear();
    };

    return (
        <Box component="form" onSubmit={handleSubmit} display="flex" gap={2} mb={4}>
        <TextField
            label="Machine name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
        />
        <TextField
            select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value as MachineType)}
            fullWidth
        >
            <MenuItem value="Pump">Pump</MenuItem>
            <MenuItem value="Fan">Fan</MenuItem>
        </TextField>
        <Button type="submit" variant="contained">
            {selectedMachine ? 'Update' : 'Add'}
        </Button>
        {selectedMachine && (
            <Button onClick={onClear} variant="outlined">
                Cancel
            </Button>
        )}
        </Box>
    );
}
