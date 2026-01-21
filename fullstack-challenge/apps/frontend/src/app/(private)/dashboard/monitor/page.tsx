import { MonitoringTable } from '@/components/monitoring/monitoringTable';
import { Container, Typography } from '@mui/material';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function MonitoringPage() {
  const session = await getServerSession();
  if (!session) {
    redirect('/');
  }

  return (
    <Container>
      <Typography variant="h4" mb={3}>
        Monitoramento
      </Typography>

      <MonitoringTable />
    </Container>
  );
}
