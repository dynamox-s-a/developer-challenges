import { NFTData } from 'data/NFTData';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HistoryCard from './HistoryCard';

const History = () => {
  return (
    <Paper sx={{ px: 1.5, py: 2, height: 350 }}>
      <Stack pl={1.5} pr={1} alignItems="center" justifyContent="space-between">
        <Typography variant="h5">History</Typography>
        <Button variant="contained" color="secondary" size="small">
          See all
        </Button>
      </Stack>

      <Box mt={2}>
        {NFTData.slice(0, 3).map((item) => (
          <HistoryCard key={item.id} data={item} />
        ))}
      </Box>
    </Paper>
  );
};

export default History;
