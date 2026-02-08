import * as React from 'react';
import {
    AppBar,
    Box,
    Button,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

const drawerWidth = 240;

type NavItem = { label: string; to: string };

export default function AppLayout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const userEmail = useAppSelector((s) => s.auth.user?.email) || '';

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const navItems: NavItem[] = [
        { label: 'Machines', to: '/machines' },
        { label: 'Monitoring Points', to: '/monitoring-points' },
    ];

    const isActive = (to: string) =>
        location.pathname === to || location.pathname.startsWith(to + '/');

    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev);
    };

    const go = (to: string) => {
        navigate(to);
        setMobileOpen(false);
    };

    const doLogout = () => {
        dispatch(logout());
        navigate('/login', { replace: true });
        setMobileOpen(false);
    };

    const drawer = (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2, fontWeight: 800 }}>
                DynaPredict
            </Typography>

            {!!userEmail && (
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', px: 2, pb: 1 }}
                    noWrap
                >
                    {userEmail}
                </Typography>
            )}

            <Divider />

            <List>
                {navItems.map((item) => (
                    <ListItem key={item.to} disablePadding>
                        <ListItemButton
                            onClick={() => go(item.to)}
                            selected={isActive(item.to)}
                            sx={{ textAlign: 'center' }}
                        >
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}

                <Divider sx={{ my: 1 }} />

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={doLogout}
                        sx={{ textAlign: 'center' }}
                    >
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />

            <AppBar component="nav" position="fixed" elevation={0}>
                <Toolbar>
                    {/* Mobile menu */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, fontWeight: 800 }}
                    >
                        DynaPredict
                    </Typography>

                    {/* Desktop links */}
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.to}
                                onClick={() => go(item.to)}
                                sx={{
                                    color: '#fff',
                                    opacity: isActive(item.to) ? 1 : 0.85,
                                    fontWeight: isActive(item.to) ? 800 : 600,
                                    textDecoration: isActive(item.to)
                                        ? 'underline'
                                        : 'none',
                                    textUnderlineOffset: '6px',
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}

                        <Button
                            onClick={doLogout}
                            startIcon={<LogoutIcon />}
                            sx={{ color: '#fff', ml: 1, fontWeight: 700 }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <nav>
                {/* Mobile drawer only */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>

            {/* Main content */}
            <Box component="main" sx={{ flexGrow: 1 }}>
                {/* spacer so content isn't behind AppBar */}
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
