import { Box, Typography, Stack, Divider } from '@mui/material';
import { dataItems } from './dataItems';
import { Container } from './styles';

const Filters = () => (
  <Container>
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-evenly"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={2}
    >
      {dataItems.map((item, index) => (
        <Box key={index} display="flex" alignItems="center">
          <img src={item.icon} alt={item.text} />
          <Typography variant="body1" sx={{ marginLeft: 1 }}>
            {item.text}
          </Typography>
        </Box>
      ))}
    </Stack>
  </Container>
);

export default Filters;
