import Logout from '@mui/icons-material/Logout';
import Menu from '@mui/icons-material/Menu';
import PrecisionManufacturing from '@mui/icons-material/PrecisionManufacturing';
import Sensors from '@mui/icons-material/Sensors';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { type ReactNode, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { ColorModeToggle } from '../components/ColorModeToggle';
import { logout } from '../features/auth/authSlice';
import { DRAWER_WIDTH } from '../theme/createAppTheme';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/machines', label: 'Machines', icon: <PrecisionManufacturing /> },
  { to: '/monitoring-points', label: 'Monitoring points', icon: <Sensors /> },
];

const MAIN_CONTENT_ID = 'main-content';

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Box component="nav" aria-label="Main">
      {/* Spacer: the fixed AppBar sits over the top of the drawer. */}
      <Toolbar />
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            onClick={onNavigate}
            sx={{
              minHeight: 48,
              // NavLink sets aria-current="page" on the active route; style
              // it with weight as well as colour, never colour alone.
              '&[aria-current="page"]': {
                bgcolor: 'action.selected',
                fontWeight: 600,
                '& .MuiListItemText-primary': { fontWeight: 600 },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

/**
 * Shell for the private pages. Mobile first: below `md` the navigation is a
 * temporary drawer behind a menu button; from `md` up it is always visible.
 */
export function AppLayout() {
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.auth.user?.email);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Link
        href={`#${MAIN_CONTENT_ID}`}
        sx={(theme) => ({
          position: 'absolute',
          left: theme.spacing(1),
          top: -100,
          zIndex: theme.zIndex.tooltip,
          p: 1,
          bgcolor: 'background.paper',
          '&:focus': { top: theme.spacing(1) },
        })}
      >
        Skip to main content
      </Link>

      <AppBar
        component="header"
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            aria-label="Open navigation"
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            sx={{ width: 44, height: 44, display: { md: 'none' } }}
          >
            <Menu />
          </IconButton>
          <Typography
            variant="h6"
            component="p"
            noWrap
            sx={{ flexGrow: 1, fontWeight: 600 }}
          >
            DynaPredict
          </Typography>
          {email && (
            <Typography
              variant="body2"
              noWrap
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              {email}
            </Typography>
          )}
          <ColorModeToggle />
          <Tooltip title="Sign out">
            <IconButton
              color="inherit"
              edge="end"
              aria-label="Sign out"
              onClick={() => void dispatch(logout())}
              sx={{ width: 44, height: 44 }}
            >
              <Logout />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        id="mobile-navigation"
        variant="temporary"
        open={mobileOpen}
        onClose={closeMobile}
        sx={{
          display: { md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        <Navigation onNavigate={closeMobile} />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        <Navigation />
      </Drawer>

      <Box
        component="main"
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        sx={{
          flexGrow: 1,
          // min-width 0 lets wide children (tables) scroll inside their own
          // container instead of widening the page.
          minWidth: 0,
          p: { xs: 2, sm: 3 },
          outline: 'none',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
