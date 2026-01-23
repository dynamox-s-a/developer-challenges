import { Box, Card, CardContent, Grid, Typography, Stack, Button } from '@mui/material';
import { Sort as SortIcon, Widgets as WidgetsIcon } from '@mui/icons-material';
import MonitoringPointsPage from '../../pages/MonitoringPointsPage';

interface DashboardHomeProps {
  totalMachines: number;
  totalPoints: number;
  activeSensors: number;
  sortBy: string;
  order: 'asc' | 'desc';
  onOpenSort: () => void;
}

export const DashboardHome = ({ 
  totalMachines, 
  totalPoints, 
  activeSensors,
  sortBy,
  order,
  onOpenSort
}: DashboardHomeProps) => {
  return (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" variant="overline">Total de Máquinas</Typography>
              <Typography variant="h4">{totalMachines}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" variant="overline">Pontos Ativos</Typography>
              <Typography variant="h4">{totalPoints}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" variant="overline">Sensores</Typography>
              <Typography variant="h4">{activeSensors}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {totalPoints === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8, 
            px: 3,
            bgcolor: '#fafafa',
            borderRadius: 2,
            border: '2px dashed #e0e0e0'
          }}
        >
          <WidgetsIcon sx={{ fontSize: 64, color: '#692746', mb: 2, opacity: 0.7 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum ponto de monitoramento encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Crie uma máquina e adicione pontos de monitoramento para começar a visualizar dados.
          </Typography>
        </Box>
      ) : (
        <>
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2, mt: 1 }}>
            <Button 
              variant="text" 
              startIcon={<SortIcon />} 
              sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}
              onClick={onOpenSort}
            >
              Ordenar
            </Button>
          </Stack>
          <MonitoringPointsPage sortBy={sortBy} order={order} />
        </>
      )}
    </>
  );
};
