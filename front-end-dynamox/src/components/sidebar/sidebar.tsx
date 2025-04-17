import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import SensorsIcon from "@mui/icons-material/Sensors";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Link, useLocation } from "react-router-dom";

import Header from "../header/header";

const drawerWidth = 240;

const menuItems = [
  { text: "Home", icon: <HomeOutlinedIcon />, path: "/" },
  { text: "Machine Management", icon: <PrecisionManufacturingIcon />, path: "/machines" },
  { text: "Sensors Management", icon: <SensorsIcon />, path: "/sensors" },
  { text: "Monitoring Points", icon: <LocationOnOutlinedIcon />, path: "/points" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <>
      <Header />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
