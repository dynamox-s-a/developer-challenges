import { Button, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';

function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={'not-found-container'}>
      <Typography variant="h1">404 Not Found</Typography>
      <Typography variant="h5">{`Não foi possível encontrar a rota: ${location.pathname}`}</Typography>
      <Button
        onClick={() => navigate('/')}
        variant="contained"
        sx={{ margin: '40px' }}
      >
        <Typography variant="h6">Voltar para página de início</Typography>
      </Button>
      <Link to="/"></Link>
    </div>
  );
}

export default NotFound;
