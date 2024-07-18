"use client"

import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Card, CardContent, CardActions, Button, Typography, Box} from '@mui/material';
import {deleteMachine, machineDeleted} from '@/src/store/machinesSlice';
import EditMachineModal from './EditMachineModal';

const MachineCard: React.FC<{ machine: any; }> = ({machine}) => {
    const dispatch = useDispatch();
    const [editModalOpen, setEditModalOpen] = useState(false);

    const handleDelete = () => {
        try {
            dispatch(deleteMachine(machine.id));
            dispatch(machineDeleted(machine.id));
        } catch {

        }
    };


    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">{machine.name}</Typography>
                    <Typography variant="body1">{machine.type}</Typography>
                    <Button variant="outlined" color="primary" onClick={() => setEditModalOpen(true)}>Editar</Button>
                    <Button variant="outlined" color="secondary" onClick={handleDelete}>Deletar</Button>
                </Box>
            </CardContent>
            <EditMachineModal machine={machine} open={editModalOpen} handleClose={() => setEditModalOpen(false)} />
        </Card>
    );
};

export default MachineCard;
