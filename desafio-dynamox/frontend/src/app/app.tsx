import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import MachinesPage from './pages/MachinesPages';
import PointsPage from './pages/PointsPages';
import {
  createTheme, ThemeProvider, CssBaseline, AppBar, Toolbar, Typography,
  Container, Box, Button, TextField, Alert, Tabs, Tab, useMediaQuery
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#692746' },
    background: { default: '#f5f5f5' }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform:'none'
        } 
      }
    }
  }
});

const LoginScreen = ({ onLogin }: { onLogin: (name: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@dynamox.net' && password === '123456') {
      onLogin('Admin User');
    } else {
      setError(true);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, bgcolor: 'white', boxShadow: 3, borderRadius: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Box sx={{ mb: 3}}>
          <img 
          src="/dynamox-logo.png"  
          alt="Logo Dynamox" 
          style={{height: '100px', objectFit: 'contain'}} />
        </Box>
        <Typography variant="h5" align="center" gutterBottom>Login</Typography>
        <TextField fullWidth margin="normal" label="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <TextField fullWidth margin="normal" label="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>Credenciais inválidas.</Alert>}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>Entrar</Button>
      </Box>
    </Container>
  );
};

const MainLayout = ({ user, onLogout }: { user: string; onLogout: () => void }) => {
  const [tab, setTab] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" sx={{ bgcolor: '#692746' }}>
        <Toolbar sx={{ flexWrap: 'wrap'}}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: 1 }}>
            <img 
              src="/logo-dynamox-white.png" 
              alt="Logo Dynamox Branco" 
              style={{
                height: '60px',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)'
              }} />
          </Box>
          {/* <Typography variant="h6" sx={{ flexGrow: 1 }}>Dynamox Dashboard</Typography> */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, display: {xs: 'none', sm: 'block'} }}>{user}</Typography>
            <Button color="inherit" size="small"onClick={onLogout}>Sair</Button>
          </Box>
        </Toolbar>

        <Tabs 
          value={tab} 
          onChange={(e, v) => setTab(v)} 
          textColor="inherit" 
          indicatorColor="secondary" 
          variant="scrollable" 
          scrollButtons="auto" 
          centered={!isMobile}
        >
          <Tab label="Máquinas" />
          <Tab label="Pontos de Monitoramento" />
        </Tabs>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4}, mb: 4, flexGrow: 1, px: {xs: 2, md: 3} }}>
        {tab === 0 && <MachinesPage />}
        {tab === 1 && <PointsPage />}
      </Container>
    </Box>
  );
};

export default function App() {
  const [user, setUser] = useState<string | null>(null);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {!user ? (
          <LoginScreen onLogin={setUser} />
        ) : (
          <MainLayout user={user} onLogout={() => setUser(null)} />
        )}
      </ThemeProvider>
    </Provider>
  );
}