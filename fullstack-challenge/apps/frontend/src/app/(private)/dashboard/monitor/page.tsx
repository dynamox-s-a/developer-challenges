import { MonitoringTable } from '@/components/monitoring/monitoringTable';
import { Container, Typography } from '@mui/material';

export default function MonitoringPage() {
  return (
    <Container>
      <Typography variant="h4" mb={3}>
        Monitoring Points
      </Typography>

      <MonitoringTable />
    </Container>
  );
}
