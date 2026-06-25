import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import graphIcon from '../assets/imgs/icons/faixa_dinamica.svg'
import gpsIcon from '../assets/imgs/icons/GPS_24px.svg'
import rpmIcon from '../assets/imgs/icons/rpm.svg'
import machineIcon from '../assets/imgs/icons/maquina.svg'
import timeIcon from '../assets/imgs/icons/intervalo_amostras.svg'


const MachineDashboard = () => {
    return (
        <Box>
            <AppBar position="static" sx={{ bgcolor: 'white', color: 'dark' }}>
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
                        marginBottom: '2rem',
                        padding: '0.5rem',
                    }}
                >
                    <Box
                        sx={{
                            alignItems: 'center',
                            borderRight: '1px solid',
                            borderColor: 'light1',
                            display: 'flex',
                            flexGrow: 1,
                            fontSize: '0.875rem',
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
                            fontSize: '0.875rem',
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
                            fontSize: '0.875rem',
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
                            fontSize: '0.875rem',
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
                            fontSize: '0.875rem',
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
                        padding: '1rem'
                    }}
                >

                </Box>
            </Box>
        </Box>
    )
}

export default MachineDashboard
