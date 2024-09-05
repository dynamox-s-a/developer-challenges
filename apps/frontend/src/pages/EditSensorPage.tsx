import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, CssBaseline, MenuItem, Container, Paper, Typography, Divider } from '@mui/material';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import MainLayout from '../components/MainLayout';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from '../components/CustomBreadcrumbs';

const sensorStatusOptions = ["Ativo", "Inativo", "Em Manutenção"];

const EditSensorPage = () => {
  const { id, monitoringId, sensorId } = useParams<{ id: string; monitoringId: string; sensorId: string }>();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  
  const apiUrl = import.meta.env.VITE_API_URL || 'https://dynamax-13e4b3075752.herokuapp.com/api'; // URL dinâmica da API

  useEffect(() => {
    const fetchSensorDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(
          `${apiUrl}/machines/${id}/monitorings/${monitoringId}/sensors/${sensorId}`,
          config
        );
        const { name, status } = response.data;
        setName(name);
        setStatus(status);
      } catch (error) {
        console.error('Erro ao buscar detalhes do sensor:', error);
      }
    };

    fetchSensorDetails();
  }, [id, monitoringId, sensorId]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const sensorData = {
        name,
        status,
      };

      await axios.put(
        `${apiUrl}/machines/${id}/monitorings/${monitoringId}/sensors/${sensorId}`,
        sensorData,
        config
      );

      navigate(`/machines/${id}/monitorings/${monitoringId}`);
    } catch (error) {
      console.error('Erro ao atualizar sensor:', error);
    }
  };

  const breadcrumbs = [
    { label: "Máquinas", href: "/machines" },
    { label: "Monitoramento", href: `/machines/${id}` },
    { label: "Sensores", href: `/machines/${id}/monitorings/${monitoringId}` },
    { label: "Editar Sensor" },
  ];

  return (
    <MainLayout>
      <Helmet>
        <title>Novo Sensor</title>
      </Helmet>

      <CustomBreadcrumbs breadcrumbs={breadcrumbs} />
      <Divider />
      <Box
        sx={{
          display: "flex",
          height: "90vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%', borderRadius: 2 }}>
          <Typography variant="h6" component="h1" gutterBottom sx={{ color: '#3f51b5', fontWeight: 500 }}>
            Editar Sensor
          </Typography>
          <Typography variant="body2" gutterBottom sx={{ color: '#6b7280', marginBottom: 2 }}>
            Atualize as informações do sensor selecionado.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Nome do Sensor"
              margin="normal"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              select
              label="Status do Sensor"
              margin="normal"
              variant="outlined"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              {sensorStatusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{
                backgroundColor: '#6366f1',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#4f46e5',
                },
                textTransform: 'none',
                borderRadius: '8px',
              }}
            >
              Salvar
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate(-1)}
              sx={{
                borderColor: '#d1d5db',
                color: '#6b7280',
                textTransform: 'none',
                borderRadius: '8px',
              }}
            >
              Voltar
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
    </MainLayout>
  );
};

export default EditSensorPage;
