"use client"

import { Container, Typography, Box } from '@mui/material';
import { LoginForm } from '../components/forms/login-form';

const HomePage = () => {
  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default HomePage;
