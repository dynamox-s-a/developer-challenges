import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Paper, Typography } from "@mui/material";
import axios from "axios";
import Sidebar from "../components/Sidebar";

interface Sensor {
  _id: string;
  name: string;
  type: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

const SensorDetailsPage = () => {
  const { id, monitoringId, sensorId } = useParams<{
    id: string;
    monitoringId: string;
    sensorId: string;
  }>();
  const [sensor, setSensor] = useState<Sensor | null>(null);

  // Usando import.meta.env para pegar a URL da API dinamicamente no Vite
  const apiUrl = import.meta.env.VITE_API_URL || 'https://dynamax-13e4b3075752.herokuapp.com/api';

  useEffect(() => {
    const fetchSensorDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(
          `${apiUrl}/machines/${id}/monitorings/${monitoringId}/sensors/${sensorId}`,
          config
        );
        setSensor(response.data);
        console.log(response.data); // Verifique se os dados estão vindo corretamente
      } catch (error) {
        console.error("Erro ao buscar detalhes do sensor:", error);
      }
    };

    fetchSensorDetails();
  }, [apiUrl, id, monitoringId, sensorId]);

  if (!sensor) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Detalhes do Sensor
          </Typography>
          <Typography>Nome: {sensor.name}</Typography>
          <Typography>Tipo: {sensor.type}</Typography>
          <Typography>Valor: {sensor.value}</Typography>
          <Typography>
            Data/Hora: {new Date(sensor.updatedAt).toLocaleString()}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default SensorDetailsPage;
