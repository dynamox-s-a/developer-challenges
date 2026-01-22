import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAllMachines } from '../features/machines/machineSlice';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MachinesPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.machines);

  useEffect(() => {
    dispatch(fetchAllMachines());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Hub de Máquinas (Teste)</Typography>
      {items.map((machine) => (
        <Accordion key={machine.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 'bold' }}>{machine.name}</Typography>
            <Typography sx={{ ml: 2, color: 'text.secondary' }}>— {machine.type}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">ID da Máquina: {machine.id}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default MachinesPage;