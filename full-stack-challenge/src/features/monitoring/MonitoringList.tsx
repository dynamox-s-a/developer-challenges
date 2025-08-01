import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel,
    TablePagination,
    Typography,
    } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { useState } from 'react';

type Order = 'asc' | 'desc';

interface HeadCell {
    id: keyof DisplayMonitoringPoint;
    label: string;
}

interface DisplayMonitoringPoint {
    machineName: string;
    machineType: string;
    pointName: string;
    sensorModel: string;
}

const headCells: HeadCell[] = [
    { id: 'machineName', label: 'Machine name' },
    { id: 'machineType', label: 'Type machine' },
    { id: 'pointName', label: 'Point name' },
    { id: 'sensorModel', label: 'Sensor model' },
];

export default function MonitoringList() {
    const machines = useSelector((state: RootState) => state.machines.list);
    const points = useSelector((state: RootState) => state.monitoring.list);

    const data: DisplayMonitoringPoint[] = points.map(point => {
        const machine = machines.find(m => m.id === point.machineId);
        return {
            machineName: machine?.name || 'N/A',
            machineType: machine?.type || 'N/A',
            pointName: point.name,
            sensorModel: point.sensor?.model || 'Without Sensor',
        };
    });

    const [orderBy, setOrderBy] = useState<keyof DisplayMonitoringPoint>('machineName');
    const [order, setOrder] = useState<Order>('asc');
    const [page, setPage] = useState(0);
    const rowsPerPage = 5;

    const handleSort = (property: keyof DisplayMonitoringPoint) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedData = [...data].sort((a, b) => {
        const aVal = a[orderBy].toString().toLowerCase();
        const bVal = b[orderBy].toString().toLowerCase();
        return (order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal));
    });

    const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <>
        <Typography variant="h6" gutterBottom>
            Monitoring Points
        </Typography>

        <TableContainer component={Paper}>
            <Table>
            <TableHead>
                <TableRow>
                {headCells.map(cell => (
                    <TableCell key={cell.id}>
                    <TableSortLabel
                        active={orderBy === cell.id}
                        direction={orderBy === cell.id ? order : 'asc'}
                        onClick={() => handleSort(cell.id)}
                    >
                        {cell.label}
                    </TableSortLabel>
                    </TableCell>
                ))}
                </TableRow>
            </TableHead>

            <TableBody>
                {paginatedData.map((row, index) => (
                <TableRow key={index}>
                    <TableCell>{row.machineName}</TableCell>
                    <TableCell>{row.machineType}</TableCell>
                    <TableCell>{row.pointName}</TableCell>
                    <TableCell>{row.sensorModel}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>

        <TablePagination
            component="div"
            count={data.length}
            page={page}
            onPageChange={(_e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
        />
        </>
  );
}
