import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Box>
        <Button onClick={() => navigate('/data')}>
          Acessar dados da máquina
        </Button>
      </Box>
      <Footer />
    </>
  );
}

export default Home;
