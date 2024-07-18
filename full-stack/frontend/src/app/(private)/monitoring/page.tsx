"use client"

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/store/store';
import { Button, Container, Grid, Typography, Pagination, PaginationItem } from '@mui/material';
import MonitoringPointsList from '@/src/components/monitoring/MonitoringPointsList';
import { fetchMonitoringPoints, MonitoringPoint } from '@/src/store/monitoringPointsSlice';
import MonitoringPointForm from "@/src/components/monitoring/MonitoringPointForm";
import SensorAssociationForm from "@/src/components/monitoring/SensorAssociationForm";
import {useRouter} from "next/navigation";
import {getToken} from "@/src/utils/auth";

const MonitoringPointsPage: React.FC = () => {
    const dispatch = useDispatch();
    const monitoringPoints = useSelector((state: RootState) => state.monitoringPoints.points);
    const totalRecords = useSelector((state: RootState) => state.monitoringPoints.points[0]?.totalCount); // Total de registros disponíveis
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSensorOpen, setIsModalSensorOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Estado local para controlar a página atual
    const recordsPerPage = 5; // Número desejado de registros por página

    useEffect(() => {
        dispatch(fetchMonitoringPoints(currentPage)); // Passa o número da página para a ação de fetch
    }, [dispatch, currentPage]);

    const router = useRouter();

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push('/');
        }
    }, [router]);

    // Calcular o número total de páginas com base nos registros disponíveis e registros por página
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Lista de Pontos de Monitoramento
            </Typography>

            <Grid container spacing={2} justifyContent="flex-end" mb={5}>
                <Grid item>
                    <Button variant="contained" onClick={() => setIsModalOpen(true)}>Criar monitoramento</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={() => setIsModalSensorOpen(true)}>Associar sensor</Button>
                </Grid>
            </Grid>

            <MonitoringPointsList points={monitoringPoints} />

            {totalPages > 1 && (
                <Grid container justifyContent="center" mt={3}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        showFirstButton
                        showLastButton
                        renderItem={(item) => (
                            <PaginationItem
                                component={Button}
                                {...item}
                            />
                        )}
                    />
                </Grid>
            )}

            <MonitoringPointForm open={isModalOpen} handleClose={() => setIsModalOpen(false)} />
            <SensorAssociationForm open={isModalSensorOpen} handleClose={() => setIsModalSensorOpen(false)} />
        </Container>
    );
};

export default MonitoringPointsPage;
