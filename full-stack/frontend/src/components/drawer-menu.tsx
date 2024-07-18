"use client"

import React from 'react';
import {useState} from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Divider, Button
} from '@mui/material';
import {Menu} from 'lucide-react';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from 'next/link';
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {removeToken} from "@/src/utils/auth";
import {logout} from "@/src/store/authSlice";

export const DrawerMenu = ({children}: { children: React.ReactNode }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = () => {
        removeToken();
        dispatch(logout());
        router.push('/');
    };


    const drawerContent = (
        <Box sx={{width: 240, my: 8}}>
            <List>
                <Link href="/machines" passHref legacyBehavior>
                    <ListItem button component="a">
                        <ListItemText primary="Criar máquina"/>
                    </ListItem>
                </Link>
                <Link href="/monitoring" passHref legacyBehavior>
                    <ListItem button component="a">
                        <ListItemText primary="Monitoramento de Pontos e Sensores"/>
                    </ListItem>
                </Link>
            </List>
            <Divider sx={{my: 2}}/>
            <Button variant="contained" color="secondary" onClick={handleLogout} fullWidth>
                Logout
            </Button>
        </Box>
    );

    return (
        <Box sx={{display: 'flex'}}>
            <AppBar position="fixed" sx={{zIndex: theme.zIndex.drawer + 1}}>
                <Toolbar>
                    {!isDesktop && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                        >
                            <Menu/>
                        </IconButton>
                    )}
                    <Typography variant="h6" noWrap component="div">
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            {isDesktop ? (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {width: 240, boxSizing: 'border-box'},
                    }}
                >
                    {drawerContent}
                </Drawer>
            ) : (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        [`& .MuiDrawer-paper`]: {width: 240, boxSizing: 'border-box'},
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}
            <Box
                component="main"
                sx={{flexGrow: 1, p: 1, width: {sm: `calc(100% - ${240}px)`}}}
            >
                <Toolbar/>
                {children}
            </Box>
        </Box>
    );
};

