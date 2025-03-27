'use client'

import React, { useState, useEffect } from 'react';
import { Modal,
    TextField, 
    Typography, 
    Select, 
    MenuItem, 
    SelectChangeEvent, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Button,
    IconButton,
    Container,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { BoxStyled } from './styles';
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { changeMonitoringPoints } from '@/lib/features/pointsSlice';

interface MachineModalProps {
    open: boolean;
    setOpen: Function;
}

type MonitoringPoint = {
    id: number;
    name: string;
    model: string;
    newPoint?: boolean;
}

export default function MachineModal ({ open, setOpen }:MachineModalProps) {
    const {
        monitoringPoints: oldPoints, 
        machineName, 
        machineType, 
        editPoints, 
        machineId,
    } = useAppSelector(state => state.points);
    const { id, email, password } = useAppSelector(state => state.users);
    const dispatch = useAppDispatch()
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [monitoringPoints, setMonitoringPoints] = useState<MonitoringPoint[]>([]);
    const [pointName, setPointName] = useState<string>('')
    const [pointModel, setPointModel] = useState<string>('')
    const [addingPoint, setAddingPoint] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    useEffect(() => {
        setName(machineName);
        setType(machineType);
        setMonitoringPoints(editPoints);
        setIsEdit(editPoints.length !== 0);
    }, [editPoints, machineName, machineType])

    const handleAddingMonitoringPoint = () => {
        const newMonitoringPoint:MonitoringPoint = {
            id: oldPoints.length + monitoringPoints.length + 1,
            name: pointName,
            model: pointModel,
            newPoint: true,
        }
        setMonitoringPoints([...monitoringPoints, newMonitoringPoint]);
        setPointModel('');
        setPointName('');
        setAddingPoint(false);
    }

    const handleDeleteMonitoringPoint = async (id:number) => {
        const pointRequest = new Request(`http://localhost:3333/points/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${email}:${password}`
            }
        });

        await fetch(pointRequest)
        const newMonitoringPoints = monitoringPoints.filter(i => i.id !== id);
        setMonitoringPoints(newMonitoringPoints);
    }

    const addPoints = async () => {
        const machineRequest = new Request('http://localhost:3333/machines', {
            method: 'POST',
            body: JSON.stringify({
                user_id: id,
                name,
                type
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${email}:${password}`
            }
        });

        const machineData = await fetch(machineRequest)
        const machineResponse = await machineData.json();

        monitoringPoints.forEach(async (i) => {
            const pointRequest = new Request('http://localhost:3333/points', {
                method: 'POST',
                body: JSON.stringify({
                    machine_id: machineResponse.id,
                    name: i.name,
                    model: i.model,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${email}:${password}`
                }
            });

            const pointData = await fetch(pointRequest)
            const pointResponse = await pointData.json();

            i.id = pointResponse.id
        });

        return machineResponse.id
    }

    const editingPoints = async () => {
        monitoringPoints.forEach(async (i) => {
            const pointRequest = new Request('http://localhost:3333/points', {
                method: i.newPoint ? 'POST' : 'PUT',
                body: JSON.stringify({
                    id: i.id,
                    machine_id: machineId,
                    name: i.name,
                    model: i.model,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${email}:${password}`
                }
            });

            const pointData = await fetch(pointRequest)
            const pointResponse = await pointData.json();

            i.id = pointResponse.id
        });

        const machineRequest = new Request('http://localhost:3333/machines', {
            method: 'PUT',
            body: JSON.stringify({
                id: machineId,
                user_id: id,
                name,
                type
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${email}:${password}`
            }
        });

       await fetch(machineRequest)
    }


    const handleSubmit = async () => {
        let machine_id: number
        if(!isEdit) {
            machine_id = await addPoints()
        }else {
            await editingPoints()
            machine_id = machineId
        }

        const newMonitoringPoints = monitoringPoints.filter(i => {
            if(type === 'Pump'){
                return i.model === 'HF+'
            }
            else {
                return true
            }
        }).map(i => ({
            machineId: machine_id,
            id: i.id,
            machineName: name,
            machineType: type,
            name: i.name,
            model: i.model,
        }));

        const newOldPoints = oldPoints.filter(i => !newMonitoringPoints.some(j => j.id === i.id));

        const newArray = [...newOldPoints, ...newMonitoringPoints].sort((a,b) => a.machineId > b.machineId ? a.machineId : b.machineId)

        dispatch(changeMonitoringPoints({points: newArray, isEdit}))
        setOpen(false);
    }

    const handleDelete = async () => {
        const pointsToDelete = oldPoints.filter(i => i.machineId === machineId);

        pointsToDelete.forEach(async (i) => {
            const pointRequest = new Request(`http://localhost:3333/points/${i.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${email}:${password}`
                }
            });

            await fetch(pointRequest)
        });

        const machineRequest = new Request(`http://localhost:3333/machines/${machineId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${email}:${password}`
            }
        });

        await fetch(machineRequest)

        const newMonitoringPoints = oldPoints.filter(i => i.machineId !== machineId);
        dispatch(changeMonitoringPoints({points: newMonitoringPoints, isEdit}));
        setOpen(false);
    }

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
        >
            <BoxStyled>
                <Typography sx={{m:3}} variant='h5'>Create new Machine</Typography>
                <TextField 
                    required
                    label="Name"
                    defaultValue={name}
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    sx={{m:3}}
                />
                <Select
                    labelId='type-select-label'
                    id='type-select'
                    value={type}
                    label="Type"
                    onChange={(e:SelectChangeEvent) => setType(e.target.value)}
                    sx={{m:3}}
                >
                    <MenuItem value="Pump">Pump</MenuItem>
                    <MenuItem value="Fan">Fan</MenuItem>
                </Select>
                <Button onClick={() => setAddingPoint(!addingPoint)} variant="outlined">
                    {addingPoint ? 'Cancel' : 'Add'} monitoring point
                </Button>
                <TableContainer sx={{m:3, width: 'auto'}} component={Paper}>
                    <Table aria-label="simple table">
                        <TableBody>
                        {monitoringPoints.map((monitoringPoint) => (
                            <TableRow
                                key={monitoringPoint.name}
                                sx={{ 
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    backgroundColor: type === 'Pump' && monitoringPoint.model !== 'HF+' ? 'lightgrey' : 'WHITE'
                                }}
                            >
                                <TableCell >{monitoringPoint.name}</TableCell>
                                <TableCell align="right">{monitoringPoint.model}</TableCell>
                                <TableCell align="right">
                                <IconButton aria-label='add' onClick={() => handleDeleteMonitoringPoint(monitoringPoint.id)}>
                                    <DeleteIcon/>
                                </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {addingPoint && <Container sx={{m:3, p: '0!important', display:'flex', justifyContent: 'space-between', width:'auto'}}>
                    <TextField
                        required
                        label="Point name"
                        defaultValue={pointName}
                        onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPointName(e.target.value)}
                        sx={{width: '40%'}}
                    />
                    <Select
                        labelId='model-select-label'
                        id='model-select'
                        value={pointModel}
                        label="Model"
                        onChange={(e:SelectChangeEvent) => setPointModel(e.target.value)}
                        sx={{width: '25%'}}
                    >
                        <MenuItem value="HF+">HF+</MenuItem>
                        <MenuItem value="TcAg" disabled={type ==='Pump'}>TcAg</MenuItem>
                        <MenuItem value="TcAs" disabled={type ==='Pump'}>TcAs</MenuItem>
                    </Select>
                    <IconButton aria-label='add' onClick={handleAddingMonitoringPoint}>
                        <AddIcon/>
                    </IconButton>
                </Container>}
                <Button onClick={() => handleSubmit()} variant="outlined">
                    {isEdit ? 'Edit' : 'Create'}
                </Button>
                {isEdit && <Button onClick={() => handleDelete()} variant="outlined">
                    Delete
                </Button>}
                <Button onClick={() => setOpen(false)} variant="outlined">
                    Cancel
                </Button>
            </BoxStyled>
        </Modal>
    )
}