import { AppBar, Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography, Button } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { LogoutOutlined } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function SidebarComponent() {
    const { user, logout } = useAuth();
    const menuItems = [
        { text: 'Home', path: '/' },
        { text: 'Machine', path: '/about' },
        { text: 'Sensors', path: '/sensors' },
    ];

    const handleLogout = () => {
        logout();
    };

    const drawerWidth = 240;
    const colorBG = '#1976d2';
    const colorFont = '#fff';

    return (
        <>
            <Box sx={{ display: 'flex' }}>                <CssBaseline />

                <AppBar position="fixed" sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                    backgroundColor: colorBG
                }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            Dyna System
                        </Typography>
                    </Toolbar>                </AppBar>

                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            backgroundColor: colorBG,
                            color: colorFont,
                            display: 'flex',
                            flexDirection: 'column'
                        },                    }}                >

                    <Box sx={{ p: 2, borderBottom: `1px solid ${colorFont}30` }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            Bem-vindo!
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {user?.name || 'Usuário'}
                        </Typography>                    </Box>

                    <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                        <List>
                            {menuItems.map((item) => (
                                <ListItem key={item.text} disablePadding>
                                    <ListItemButton component={RouterLink} to={item.path}>
                                        <ListItemText primary={item.text} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>                    </Box>

                    <Box sx={{ p: 2, mt: 'auto' }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<LogoutOutlined />}
                            onClick={handleLogout}
                            sx={{
                                color: colorFont,
                                borderColor: colorFont,
                                '&:hover': {
                                    backgroundColor: `${colorFont}20`,
                                    borderColor: colorFont,
                                },
                            }}
                        >
                            Sair
                        </Button>
                    </Box>                </Drawer>

                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3 }}
                >
                    <Toolbar />
                </Box>
            </Box>        </>
    )
}