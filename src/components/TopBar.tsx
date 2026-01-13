import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export const TopBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); 
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          DynaPredict
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mr: 4 }}>
          <Button color="inherit" onClick={() => navigate('/machines')}>
            Máquinas
          </Button>
          <Button color="inherit" onClick={() => navigate('/sensors')}>
            Sensores
          </Button>
        </Box>

        <Button color="error" variant="contained" size="small" onClick={handleLogout}>
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  );
};