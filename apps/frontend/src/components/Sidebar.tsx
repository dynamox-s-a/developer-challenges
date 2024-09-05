import React, { useState } from "react";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import { Home, People, ExitToApp, Menu, Settings, PrecisionManufacturing } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const drawerWidth = 280;
  const userEmail = localStorage.getItem('userEmail') || ' ';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    // Remover o token do localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    // Redirecionar para a página de login
    navigate("/login");
  };

  const drawer = (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
      style={{
        marginTop: mobileOpen?"50px":"0px"
      }}
      >
        <Toolbar sx={{ padding: 2, display: "flex", alignItems: "center" }}>
          <Avatar
            alt="User Name"
            src="https://mui.com/static/images/avatar/1.jpg"
            sx={{ marginRight: 2 }}
          />
          <Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: "#FFFFFF" }}
            >
              Bem Vindo
            </Typography>
            <Divider />
            <Typography variant="body2" sx={{ color: "#9DA3A9" }}>
              {userEmail}
            </Typography>
          </Box>
        </Toolbar>
        <Divider sx={{ borderColor: "#2D3748" }} />
        <List
          sx={{
            "& .MuiListItemIcon-root": {
              minWidth: "40px",
              color: "#9DA3A9",
            },
            "& .MuiListItemText-primary": {
              fontWeight: 500,
              color: "#FFFFFF",
            },
          }}
        >
          <ListItem component={Link} to="/machines" sx={{ pl: 3, py: 1 }}>
            <ListItemIcon>
              <PrecisionManufacturing />
            </ListItemIcon>
            <ListItemText primary="Máquinas" />
          </ListItem>
        </List>
      </div>
      <div style={{ padding: "16px" }}>
        <List>
          <ListItem component={Button} onClick={handleLogout}>
            <ListItemIcon>
              <ExitToApp sx={{ color: "rgba(255, 0, 0, 0.8)" }} />
            </ListItemIcon>
            <ListItemText primary="Sair" sx={{ color: "#fff", textTransform: 'capitalize' }} />
          </ListItem>
        </List>
      </div>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar for mobile view */}
      <AppBar position="fixed" sx={{ display: { sm: "none" }, zIndex: 1300 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile view */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Hidden smUp>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                bgcolor: "#1A202C",
              }
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        {/* Drawer for desktop view */}
        <Hidden xsDown>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                bgcolor: "#1A202C",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </Box>
    </Box>
  );
};

export default Sidebar;
