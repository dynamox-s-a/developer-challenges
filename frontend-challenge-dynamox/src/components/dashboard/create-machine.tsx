import { Button, TextField, Box, Alert, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { DashboardLayout } from './layout';

export function CreateMachine(): React.JSX.Element {
  const [name, setMachineName] = useState('');
  const [type, setMachineType] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  async function createMachine(name: string, type: string) {
    const response = await api.post('/machine', { name, type },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
      }
    );

    return response.data;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const response = createMachine(name, type);

    console.log(response);

    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      navigate('/dashboard/overview');
    }, 2000);
  };

  return (
    <DashboardLayout>
      <Box sx={{ 
        display: { xs: 'flex', lg: 'grid' },
        maxWidth: 700, 
        margin: '0 auto',
        marginTop: '15vw',
        textAlign: 'center', 
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <Typography variant="h4" gutterBottom>
          Criar máquina
        </Typography>
        
        {showAlert && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Máquina criada com sucesso!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Name machine"
              value={name}
              onChange={(e) => setMachineName(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="machine-type-label">Tipo da Máquina</InputLabel>
              <Select
                labelId="machine-type-label"
                value={type}
                label="Tipo da Máquina"
                onChange={(e) => setMachineType(e.target.value)}
                required
              >
                <MenuItem value="Pump">Pump</MenuItem>
                <MenuItem value="Fan">Fan</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button type="submit" variant="contained" color="primary">
            Criar maquina
          </Button>
        </form>
      </Box>
      </DashboardLayout>);
}
