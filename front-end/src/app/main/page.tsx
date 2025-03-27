'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import {
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    IconButton,
} from '@mui/material';
import EditButton from '@mui/icons-material/Edit'
import MachineModal from './MachineModal';
import { useAppSelector, useAppDispatch } from '../../lib/hooks'
import { changeMonitoringPoints, createNew, editMachine } from '@/lib/features/pointsSlice';
import { logoff } from '@/lib/features/usersSlice';

import { Container, ButtonContainer } from './styles'

export default function Page() {
    const monitoringPoints = useAppSelector(state => state.points.monitoringPoints);
    const user = useAppSelector(state => state.users);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        if(!user.isLogged) {
            router.push('/login');
        }else {
            const request = new Request(`http://localhost:3333/machines/${user.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${user.email}:${user.password}`
                }
            });
    
            fetch(request).then((data) => data.json()).then((response) => {
                console.log(monitoringPoints);
                dispatch(changeMonitoringPoints({points: response}));
            })
        }
    }, []);

    const getAllPoints = (machineId: number) => {
        return monitoringPoints.filter(i => i.machineId === machineId);
    }

    return (
        <>
            <Container>
                <ButtonContainer>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            dispatch(createNew());
                            setOpen(true);
                        }}
                    >
                        Create New
                    </Button>
                    <Button variant="outlined" onClick={() => {
                        dispatch(logoff());
                        router.push('/login');
                    }}>
                        Log out
                    </Button>
                </ButtonContainer>
                <TableContainer component={Paper}>
                    <Table sx={{ width:'100%', minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Machine Name</TableCell>
                            <TableCell align="right">Machine Type</TableCell>
                            <TableCell align="right">Monitoring Point Name</TableCell>
                            <TableCell align="right">Sensor Model</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {monitoringPoints.map((monitoringPoint) => (
                            <TableRow
                                key={monitoringPoint.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <IconButton onClick={() => {
                                        const machinePoints = getAllPoints(monitoringPoint.machineId);
                                        dispatch(editMachine({
                                            machineName: monitoringPoint.machineName,
                                            machineType: monitoringPoint.machineType,
                                            machineId: monitoringPoint.machineId,
                                            editPoints: machinePoints,
                                        }));
                                        setOpen(true);
                                    }}>
                                        <EditButton />
                                    </IconButton>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {monitoringPoint.machineName}
                                </TableCell>
                                <TableCell component="th" scope="row" align='center'>
                                    {monitoringPoint.machineType}
                                </TableCell>
                                <TableCell align="center">{monitoringPoint.name}</TableCell>
                                <TableCell align="center">{monitoringPoint.model}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <MachineModal open={open} setOpen={setOpen}/>
        </>
    )
}