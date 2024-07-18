"use client"

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Grid, TextField, Pagination } from '@mui/material';
import { fetchMachines, RootState } from '@/src/store/machinesSlice';
import CreateMachineModal from '@/src/components/machines/CreateMachineModal';
import MachineCard from '@/src/components/machines/MachineCard';
import {getToken} from "@/src/utils/auth";
import {useRouter} from "next/navigation";

const MachinesPage: React.FC = () => {
    const dispatch = useDispatch();
    const machines = useSelector((state: RootState) => state.machines.machines);
    const [search, setSearch] = useState('');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchMachines());
    }, [dispatch]);

    const router = useRouter();

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push('/');
        }
    }, [router]);


    const filteredMachines = machines?.filter(machine => machine?.name?.toLowerCase().includes(search.toLowerCase()));
    const machinesPerPage = 7;
    const pageCount = Math.ceil(filteredMachines.length / machinesPerPage);
    const displayedMachines = filteredMachines.slice((currentPage - 1) * machinesPerPage, currentPage * machinesPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };


    return (
        <Container>
            <Button variant="contained" color="primary" onClick={() => setCreateModalOpen(true)} style={{ marginBottom: '20px' }}>
                Criar Máquina
            </Button>
            <TextField
                label="Buscar Máquinas"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Grid container direction="column" spacing={2}>
                {displayedMachines.map(machine => (
                    <Grid item key={machine.id}>
                        <MachineCard machine={machine} />
                    </Grid>
                ))}
            </Grid>
            <Grid container justifyContent="center" spacing={2} marginTop={2}>
                <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Grid>
            <CreateMachineModal open={createModalOpen} handleClose={() => setCreateModalOpen(false)} />
        </Container>
    );
};

export default MachinesPage;
