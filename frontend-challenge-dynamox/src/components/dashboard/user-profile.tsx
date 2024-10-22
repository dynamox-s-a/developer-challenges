import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DashboardLayout } from './layout';

interface User {
  name: string;
  email: string;
}

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');

  async function getUserInfo() {
    const response = await api.get('/user/1', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
    setUser(response.data);
  }

  async function handleChangePassword() {
    try {
      await api.put('/user/2', { password: newPassword }, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
      });
      alert('Senha alterada com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao alterar a senha!');
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20, marginLeft:'35vw' }}>
        <Card sx={{ width: 400 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Configurações de Usuário
            </Typography>
            {user ? (
              <>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                  Email: {user.email}
                </Typography>

                <TextField
                  label="Nova Senha"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleChangePassword}
                  disabled
                >
                  Alterar Senha
                </Button>
              </>
            ) : (
              <Typography variant="body2" align="center">
                Carregando informações do usuário...
              </Typography>
            )} 
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
