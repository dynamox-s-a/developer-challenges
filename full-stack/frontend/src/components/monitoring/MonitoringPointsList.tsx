import React from 'react';
import {
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper, Button,
} from '@mui/material';
import {MonitoringPoint} from '@/src/store/monitoringPointsSlice';


interface Props {
    points: MonitoringPoint[];
}

const MonitoringPointsList: React.FC<Props> = ({points}) => {


    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nome da Máquina</TableCell>
                        <TableCell>Tipo de Máquina</TableCell>
                        <TableCell>Nome do Ponto de Monitoramento</TableCell>
                        <TableCell>Modelo de Sensor</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {points.map((point) => (
                        <TableRow key={point.id}>
                            <TableCell>{point.machine.name}</TableCell>
                            <TableCell>{point.machine.type}</TableCell>
                            <TableCell>{point.name}</TableCell>
                            <TableCell>{
                                point?.sensor?.modelName === 'HFPlus' ? "HF +" : point?.sensor?.modelName
                            }</TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MonitoringPointsList;
