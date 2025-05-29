import React from 'react';
import { Box, CssBaseline, Drawer, Toolbar } from "@mui/material";
import { useAuth } from '../contexts/AuthContext';

// Componentes especializados
import { AppHeader } from './sidebar/AppHeader';
import { UserInfo } from './sidebar/UserInfo';
import { NavigationMenu } from './sidebar/NavigationMenu';
import { LogoutButton } from './sidebar/LogoutButton';

// Constantes e configurações
import { MENU_ITEMS, DRAWER_STYLES } from '../constants/navigation.constants';

/**
 * Componente de layout principal com sidebar de navegação
 * Responsável por organizar a estrutura da aplicação
 */
export default function SidebarComponent() {
    const { user, logout } = useAuth();

    const handleLogout = (): void => {
        logout();
    };    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppHeader />

            <Drawer variant="permanent" sx={DRAWER_STYLES}>
                <UserInfo user={user} />

                <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                    <NavigationMenu menuItems={MENU_ITEMS} />
                </Box>

                <LogoutButton onLogout={handleLogout} />
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
            </Box>
        </Box>
    );
}