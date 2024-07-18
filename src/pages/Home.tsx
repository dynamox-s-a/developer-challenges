import { Box } from '@mui/material';
import Filters from '../components/Filters/Filters';
import Header from '../components/Header/Header';
import Dashboard from '../components/Dashboard/Dashboard';

const Home = () => (
  <Box
    sx={{
      bgcolor: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '100%',
    }}
  >
    <Box bgcolor="#fff">
      <Header />
    </Box>
    <Box sx={{ flex: 1, p: '24px 16px 8px 16px' }}>
      <Filters />
    </Box>
    <Box sx={{ flex: 1, p: 2 }}>
      <Dashboard />
    </Box>
  </Box>
);

export default Home;
