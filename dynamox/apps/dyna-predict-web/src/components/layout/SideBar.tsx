import { Avatar, Box, Button, Divider, Drawer, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import MonitorHeart from '@mui/icons-material/MonitorHeart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import RadarIcon from '@mui/icons-material/Radar';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/features/auth/auth.slice';
import { routePaths } from '../../router/paths';

interface SideBarProps {
  width: number;
  mobileOpen: boolean;
  onClose: () => void;
  onTransitionEnd: () => void;
}

const NAVIGATION_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: routePaths.dashboard, disabled: false },
  {
    label: 'Máquinas',
    icon: <PrecisionManufacturingIcon />,
    path: routePaths.machines,
    disabled: false,
  },
  {
    label: 'Pontos de Monitoramento',
    icon: <RadarIcon />,
    path: routePaths.monitoringPoints,
    disabled: false,
  },
];

function SideBar({ width, mobileOpen, onClose, onTransitionEnd }: SideBarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate(routePaths.login);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 3 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
          <MonitorHeart fontSize="small" />
        </Avatar>
        <Typography variant="subtitle1" fontWeight="bold">
          DynaPredict
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, py: 4 }}>
        {NAVIGATION_ITEMS.map((item) => (
          <Button
            key={item.path}
            fullWidth
            startIcon={item.icon}
            disabled={item.disabled}
            variant="text"
            onClick={() => navigate(item.path)}
            sx={(theme) => ({
              justifyContent: 'flex-start',
              mb: 2,
              borderRadius: 1.5,
              textTransform: 'none',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              ...(!item.disabled &&
                pathname === item.path && {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: 'primary.main',
                  fontWeight: 600,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.25) },
                }),
            })}
          >
            {item.label}
          </Button>
        ))}
      </Box>

      <Divider />
      <Box sx={{ px: 2, py: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
            <MonitorHeart sx={{ fontSize: 16 }} />
          </Avatar>
          <Typography variant="body2" fontWeight={500} noWrap>
            {currentUser?.email}
          </Typography>
        </Box>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ fontWeight: 600 }}
        >
          Sair
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: width }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={onTransitionEnd}
        onClose={onClose}
        keepMounted
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default SideBar;
