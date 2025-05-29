import React from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Hooks customizados
import { useLogin } from '../hooks/useLogin';

// Componentes especializados
import { LoginHeader } from './auth/LoginHeader';
import { LoginForm } from './auth/LoginForm';
import { LoginActions } from './auth/LoginActions';
import { ErrorAlert } from './common/ErrorAlert';
import { Footer } from './common/Footer';

const theme = createTheme();

/**
 * Componente de autenticação responsável pela tela de login
 * Utiliza hooks customizados para separar lógica de apresentação
 */
const NewSignIn: React.FC = () => {
  const { loading, error, handleLogin, clearError } = useLogin();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <LoginHeader />
          
          <ErrorAlert error={error} onClose={clearError} />
          
          <LoginForm onSubmit={handleLogin} loading={loading} />
          
          <LoginActions />
          
          <Footer />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default NewSignIn;
