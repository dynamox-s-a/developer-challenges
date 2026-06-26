import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


import type { AppDispatch, RootState } from '../app/store';
import { fetchTelemetry } from '../features/telemetry/slice';
import { groupByMetric } from '../features/telemetry/groupByMetric';
import SyncedCharts from '../components/charts/SyncedCharts';
import gpsIcon from '../assets/imgs/icons/GPS_24px.svg'
import graphIcon from '../assets/imgs/icons/faixa_dinamica.svg'
import machineIcon from '../assets/imgs/icons/maquina.svg'
import rpmIcon from '../assets/imgs/icons/rpm.svg'
import timeIcon from '../assets/imgs/icons/intervalo_amostras.svg'
import { CircularProgress } from '@mui/material';


const MachineDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();

    const isLoading = useSelector((state: RootState) => state.telemetry.isLoading);
    const series = useSelector((state: RootState) => state.telemetry.series);

    useEffect(() => {
        dispatch(fetchTelemetry());
    }, []);

    return (
        <Box>
            <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'dark', padding: '1rem 0' }}>
                <Toolbar variant="dense">
                    <Typography
                        component="h1"
                        sx={{ fontWeight: 500 }}
                        variant="h5"
                    >
                        Análise de Dados
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ padding: { xs: '2rem 0.5rem', md: '2rem' } }}>
                <Box
                    sx={{
                        bgcolor: 'light1',
                        border: '1px solid',
                        borderColor: 'light1',
                        borderRadius: '0.25rem',
                        display: 'grid',
                        fontSize: '1rem',
                        gap: '1px',
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
                        marginBottom: '2rem',
                        overflow: 'hidden',
                        '& > *:last-child': { gridColumn: { xs: '1 / -1', md: 'auto' } },
                    }}
                >
                    {[
                        { icon: machineIcon, label: 'Máquina 1023' },
                        { icon: gpsIcon, label: 'Ponto 20192' },
                        { icon: rpmIcon, label: '200' },
                        { icon: graphIcon, label: '16g' },
                        { icon: timeIcon, label: '20 min' },
                    ].map(({ icon, label }) => (
                        <Box
                            key={label}
                            sx={{
                                alignItems: 'center',
                                bgcolor: 'white',
                                display: 'flex',
                                gap: '0.5rem',
                                justifyContent: 'center',
                                padding: '1rem',
                                textAlign: 'center',
                            }}
                        >
                            <img src={icon} /> {label}
                        </Box>
                    ))}
                </Box>
                <Box
                    sx={{
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: 'light1',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        padding: { xs: '0.5rem', md: '2rem' },
                    }}
                >
                    {
                        isLoading
                            ? (
                                <Box
                                    sx={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        height: '50vh',
                                        justifyContent: 'center',
                                        padding: '2rem',
                                    }}
                                >
                                    <CircularProgress aria-label="Loading…" color="primary" size="5rem" />
                                </Box>
                            ) : <SyncedCharts groups={groupByMetric(series)} />
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default MachineDashboard
