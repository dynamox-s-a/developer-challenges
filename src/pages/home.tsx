import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * 
 * @returns 
 * Retorna o home tela inicial com botão para tela de dados
 */
const Home: React.FC = () => {
  const navigate = useNavigate();

  /**
   * Rota para tela de dados
   */
  const handleButtonClick = () => {
    navigate('/dados');
  };

  return (
    <Container maxWidth="sm" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Box textAlign="center">
        <Typography variant="h3" gutterBottom>
          Bem-vindo à Home Page
        </Typography>
        <Button variant="contained" color="primary" size="large" onClick={handleButtonClick}>
          Ir para Dados
        </Button>
      </Box>
    </Container>
  );
}

export default Home;