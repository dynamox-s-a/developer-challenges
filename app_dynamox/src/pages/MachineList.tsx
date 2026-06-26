import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import type { Machine } from '../features/telemetry/types';

const MachineList = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [machines, setMachines] = useState<Machine[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/machines')
            .then((response) => {
                if (!response.ok) throw new Error();

                return response.json();
            })
            .then((data) => {
                setMachines(data);
                setIsLoading(false);
            })
            .catch(() => {
                setError('Erro ao buscar máquinas.');
                setIsLoading(false);
            });
    }, []);

    return (
        <Box>
            <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'dark', padding: '1rem 0' }}>
                <Toolbar variant="dense">
                    <Typography component="h1" sx={{ fontWeight: 500 }} variant="h5">
                        Máquinas
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ padding: { xs: '1rem', md: '2rem' } }}>
                {isLoading ? (
                    <Box sx={{ alignItems: 'center', display: 'flex', height: '50vh', justifyContent: 'center' }}>
                        <CircularProgress color="primary" size="5rem" />
                    </Box>
                ) : error ? (
                    <Box sx={{ border: '1px solid', borderColor: 'light1', borderRadius: '0.5rem', bgcolor: 'white', padding: '1.5rem' }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {machines.map((machine) => (
                            <Box
                                key={machine.name}
                                sx={{
                                    alignItems: 'center',
                                    bgcolor: 'white',
                                    border: '1px solid',
                                    borderColor: 'light1',
                                    borderRadius: '0.25rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '1rem 1.5rem',
                                }}
                            >
                                <Box>
                                    <Typography sx={{ fontWeight: 500 }}>{machine.name}</Typography>
                                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                        {machine.point} · {machine.rpm} RPM · {machine.dynamicRange} · {machine.sampleInterval}
                                    </Typography>
                                </Box>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={() => navigate('/data', { state: machine })}
                                >
                                    Ver dados
                                </Button>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MachineList;
