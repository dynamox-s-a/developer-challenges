'use client';

import { MachinesTable } from '@/components/dashboard/list-machines/machines-table';
import { Machines } from '@/store/reducers/machines.reducers';
import { getAll } from '@/store/reducers/machines.reducers';
import { RootState } from '@/store/rootReducer';
import { AppDispatch } from '@/store/store';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Page(): React.JSX.Element {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    
    const { machines } = useSelector((state: RootState) => state.machinesReducer);
    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
        dispatch(getAll());
    }, [dispatch]);

    const paginatedMachines = React.useMemo(() => {
        return applyPagination(machines, page, rowsPerPage);
    }, [machines, page, rowsPerPage]);

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); 
    };

    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3}>
                <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h4">Machines</Typography>
                </Stack>
            </Stack>
            <MachinesTable
                count={machines.length}  
                rows={paginatedMachines} 
                page={page}               
                rowsPerPage={rowsPerPage} 
                onPageChange={handleChangePage} 
                onRowsPerPageChange={handleChangeRowsPerPage} 
            />
        </Stack>
    );
}

function applyPagination(rows: Machines[], page: number, rowsPerPage: number): Machines[] {
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
