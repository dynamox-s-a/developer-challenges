import { Box, CardHeader, Container } from '@mui/material';
import InfoCard from './InfoCard';

function PageData() {
  return (
    <>
      <header>
        <CardHeader
          title="Análise de Dados"
          sx={{
            padding: '20px 24px',
            backgroundColor: '#fff',
            borderBottom: '1px solid #dfe3e8',
          }}
          titleTypographyProps={{
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: '24px',
          }}
        />
      </header>
      <Container>
        <InfoCard />
        <Box>
          <Box>graph 1</Box>
          <Box>graph 2</Box>
          <Box>graph 3</Box>
        </Box>
      </Container>
    </>
  );
}

export default PageData;
