import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import MachinesPage from './pages/MachinesPages';
import PointsPage from './pages/PointsPages';
import {
  createTheme, ThemeProvider, CssBaseline, AppBar, Toolbar, Typography,
  Container, Box, Button, TextField, Alert, Tabs, Tab
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#692746' },
    background: { default: '#f5f5f5' }
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
    <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, bgcolor: 'white', boxShadow: 3, borderRadius: 2, width: '100%' }}>
        <Typography variant="h5" align="center" gutterBottom>Login Dynamox</Typography>
        <TextField fullWidth margin="normal" label="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <TextField fullWidth margin="normal" label="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <Alert severity="error" sx={{ mt: 2 }}>Credenciais inválidas.</Alert>}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>Entrar</Button>
      </Box>
    </Container>
  );
};

const MainLayout = ({ user, onLogout }: { user: string; onLogout: () => void }) => {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Dynamox Dashboard</Typography>
          <Typography sx={{ mr: 2 }}>{user}</Typography>
          <Button color="inherit" onClick={onLogout}>Sair</Button>
        </Toolbar>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} textColor="inherit" indicatorColor="secondary" centered>
          <Tab label="Máquinas" />
          <Tab label="Pontos de Monitoramento" />
        </Tabs>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
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