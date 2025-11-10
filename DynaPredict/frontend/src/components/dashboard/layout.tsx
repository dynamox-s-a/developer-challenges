import React, { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import MemoryIcon from "@mui/icons-material/Memory";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SensorsIcon from "@mui/icons-material/Sensors";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
const DRAWER_WIDTH = 240;



interface MenuItem {
  text: string;
  icon?: React.ReactElement | null;
  path?: string;
  children?: MenuItem[];
  onClick?: () => void;
}

const menuItems: MenuItem[] = [
  {
    text: "Dashboard",
    icon: <HomeIcon />,
    path: "/dashboard",
  },
  {
    text: "Máquina",
    icon: <MemoryIcon />,
    children: [
      {
        text: "Criar",
        icon: <AddIcon />,
        path: "/machines/create",
      },
      {
        text: "Gerenciar",
        icon: <EditIcon />,
        path: "/machines/manage",
      },
    ],
  },
  {
    text: "Ponto de Monitoramento",
    icon: <LocationOnIcon />,
    children: [
      {
        text: "Criar",
        icon: <AddIcon />,
        path: "/monitoring-points/create",
      },
    ],
  },
  {
    text: "Sensor",
    icon: <SensorsIcon />,
    children: [
      {
        text: "Criar",
        icon: <AddIcon />,
        path: "/sensors/create",
      },
      {
        text: "Gerenciar",
        icon: <EditIcon />,
        path: "/sensors/manage",
      },
    ],
  },
];
export interface LayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar sx={{ backgroundColor: "primary.main" }}>
        <Typography variant="h6" sx={{ color: "white" }}>
          DYNAMOX
        </Typography>
      </Toolbar>

      <Divider />

     
      <List component="nav" sx={{ flexGrow: 1, overflowY: "auto" }}>
        {menuItems.map((item, idx) => (
          <React.Fragment key={idx}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.path) navigate(item.path);
                  else if (item.onClick) item.onClick();
                }}
                sx={{ pl: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>

            {item.children && item.children.length > 0 && (
              <List component="div" disablePadding>
                {item.children.map((child, cidx) => (
                  <ListItem key={`${idx}-${cidx}`} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        if (child.path) navigate(child.path);
                        else if (child.onClick) child.onClick();
                      }}
                      sx={{ pl: 6 }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {child.icon || null}
                      </ListItemIcon>
                      <ListItemText primary={child.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </React.Fragment>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Button
          onClick={() => navigate("/login")}
          startIcon={<LogoutIcon color="error" />}
          sx={{
            color: "error.main",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          Sair
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
     
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            <LogoutIcon sx={{ mr: 1 }} /> Sair
          </Button> */}
        </Toolbar>
      </AppBar>

      
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              bgcolor: "background.paper",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
