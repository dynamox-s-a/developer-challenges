import { AppBar, Toolbar, Typography, Breadcrumbs, Link, Stack, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface DashboardTopBarProps {
  currentView: 'home' | 'machines';
  userName?: string;
  onNewMachine: () => void;
}

export const DashboardTopBar = ({ currentView, userName, onNewMachine }: DashboardTopBarProps) => {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 3 }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: '0 !important' }}>
        <Breadcrumbs>
          <Link underline="hover" color="inherit" href="#">Sistema</Link>
          <Typography color="text.primary">
            {currentView === 'home' ? 'Dashboard' : 'Máquinas'}
          </Typography>
        </Breadcrumbs>
        <Stack direction="row" spacing={3} alignItems="center">
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{ 
              bgcolor: '#692746', 
              '&:hover': { bgcolor: '#521e36' },
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3
            }}
            onClick={onNewMachine}
          >
            Nova Máquina
          </Button>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Olá, {userName || "Usuário"}
          </Typography>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
