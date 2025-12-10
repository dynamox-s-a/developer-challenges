"use client";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EventIcon from "@mui/icons-material/Event";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const DRAWER_WIDTH = 240;

export function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setDrawerOpen(false);
  };

  const navItems = [
    {
      label: "Events",
      path: "/events",
      icon: <EventIcon />,
      show: true,
    },
    {
      label: "Admin Dashboard",
      path: "/admin",
      icon: <AdminPanelSettingsIcon />,
      show: isAdmin,
    },
  ];

  const visibleNavItems = navItems.filter((item) => item.show);

  const drawerContent = (
    <Box sx={{ width: DRAWER_WIDTH }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" component="div">
          Event Manager
        </Typography>
        {user && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Chip
              label={user.role}
              size="small"
              color={isAdmin ? "primary" : "default"}
              sx={{ mt: 0.5 }}
            />
          </Box>
        )}
      </Box>
      <List>
        {visibleNavItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton onClick={() => handleNavigation(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <EventIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: isMobile ? 1 : 0, mr: 4 }}
          >
            Event Manager
          </Typography>

          {!isMobile && (
            <>
              <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
                {visibleNavItems.map((item) => (
                  <Button
                    key={item.path}
                    color="inherit"
                    startIcon={item.icon}
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {user && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                    <Chip
                      label={user.role}
                      size="small"
                      color={isAdmin ? "primary" : "default"}
                    />
                  </>
                )}
                <Button
                  color="inherit"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawerContent}
      </Drawer>

      {/* Toolbar spacer */}
      <Toolbar />
    </>
  );
}
