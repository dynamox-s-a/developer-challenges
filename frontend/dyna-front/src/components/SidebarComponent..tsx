import { AppBar, Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";
//import { useState } from "react";
//import { FaReact } from "react-icons/fa";
import { Link as RouterLink } from 'react-router-dom';

export default function SidebarComponent() {


    const menuItems = [
        { text: 'Home', path: '/' },
        { text: 'Sobre', path: '/about' },
    ];

    
const drawerWidth = 240;


    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />

                {/* AppBar ajustado para deslocar a largura do Drawer */}
                <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            Meu App
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* Sidebar Permanente */}
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            {menuItems.map((item) => (
                                <ListItem key={item.text} disablePadding>
                                    <ListItemButton component={RouterLink} to={item.path}>
                                        <ListItemText primary={item.text} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>

                {/* Conteúdo principal */}
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3 }}
                >
                    <Toolbar /> {/* Para compensar a altura do AppBar */}
                    <Typography paragraph>
                        Aqui vai o conteúdo da página!
                    </Typography>
                </Box>
            </Box>


        </>
    )
}