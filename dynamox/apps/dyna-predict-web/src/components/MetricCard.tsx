import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading?: boolean;
}

function MetricCard({ title, value, icon, loading = false }: MetricCardProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="body2" color="text.secondary" sx={{ minHeight: '2.86em', textAlign: 'center', flexGrow: 1 }}>
            {title}
          </Typography>
          <Box sx={{ color: 'primary.main' }}>{icon}</Box>
        </Box>
        {loading ? (
          <Skeleton variant="text" width={60} height={48} />
        ) : (
          <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, textAlign: 'center' }}>
            {value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default MetricCard;
