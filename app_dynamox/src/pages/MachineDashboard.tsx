import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


import type { AppDispatch, RootState } from '../app/store';
import { fetchTelemetry } from '../features/telemetry/telemetrySlice';
import { groupByMetric } from '../features/telemetry/telemetry.transform';
import TimeSeriesChart from '../components/charts/TimeSeriesChart';
import gpsIcon from '../assets/imgs/icons/GPS_24px.svg'
import graphIcon from '../assets/imgs/icons/faixa_dinamica.svg'
import machineIcon from '../assets/imgs/icons/maquina.svg'
import rpmIcon from '../assets/imgs/icons/rpm.svg'
import timeIcon from '../assets/imgs/icons/intervalo_amostras.svg'


const MachineDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();

    const series = useSelector((state: RootState) => state.telemetry.series);
    const status = useSelector((state: RootState) => state.telemetry.status);

    useEffect(() => {
        dispatch(fetchTelemetry());
    }, []);

    // Usar essa lógica apenas nos componentes dos gráficos.
    // Em vez disso, utilizar spinner de Loading.
    if (status === 'idle' || status === 'loading') return <p>Carregando...</p>;
    if (status === 'failed') return <p>Erro ao carregar dados.</p>;

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
            <Box sx={{ padding: '2rem' }}>
                <Box
                    sx={{
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: 'light1',
                        borderRadius: '0.25rem',
                        display: 'flex',
                        fontSize: '1rem',
                        marginBottom: '2rem',
                        padding: '1rem',
                    }}
                >
                    <Box
                        sx={{
                            alignItems: 'center',
                            borderRight: '1px solid',
                            borderColor: 'light1',
                            display: 'flex',
                            flexGrow: 1,
                            gap: '0.5rem',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <img src={machineIcon} /> Máquina 1023
                    </Box>
                    <Box
                        sx={{
                            alignItems: 'center',
                            borderRight: '1px solid',
                            borderColor: 'light1',
                            display: 'flex',
                            flexGrow: 1,
                            gap: '0.5rem',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <img src={gpsIcon} /> Ponto 20192
                    </Box>
                    <Box
                        sx={{
                            alignItems: 'center',
                            borderRight: '1px solid',
                            borderColor: 'light1',
                            display: 'flex',
                            flexGrow: 1,
                            gap: '0.5rem',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <img src={rpmIcon} /> 200
                    </Box>
                    <Box
                        sx={{
                            alignItems: 'center',
                            borderRight: '1px solid',
                            borderColor: 'light1',
                            display: 'flex',
                            flexGrow: 1,
                            gap: '0.5rem',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <img src={graphIcon} /> 16g
                    </Box>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexGrow: 1,
                            gap: '0.5rem',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <img src={timeIcon} /> 20 min
                    </Box>
                </Box>
                <Box
                    sx={{
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: 'light1',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        padding: '1.5rem',
                    }}
                >
                    {groupByMetric(series).map((group) => (
                        <TimeSeriesChart key={group.title} group={group} />
                    ))}
                </Box>
            </Box>
        </Box>
    )
}

export default MachineDashboard
