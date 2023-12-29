import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../index.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Typography variant="h3" component="h3">
        Dynamox Front-end Developer Challenge
      </Typography>
      <Typography variant="h6" component="h5">
        Clique no botão abaixo para acessar a aba Análise de Dados.
      </Typography>
      <Button
        onClick={() => navigate('/data')}
        variant="contained"
        sx={{ margin: '40px' }}
      >
        Acessar dados da máquina
      </Button>
    </div>
  );
}

export default Home;
