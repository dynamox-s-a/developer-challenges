import DatasetOutlinedIcon from "@mui/icons-material/DatasetOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { AppSnackbar } from "../components/AppSnackbar";
import { logout } from "../features/auth/authSlice";

const drawerWidth = 248;
const navigation = [
  {
    label: "Machines",
    path: "/machines",
    icon: <PrecisionManufacturingOutlinedIcon />,
  },
  {
    label: "Monitoring points",
    path: "/monitoring-points",
    icon: <SensorsOutlinedIcon />,
  },
  {
    label: "Time series",
    path: "/time-series",
    icon: <DatasetOutlinedIcon />,
  },
];

export function AppShell() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.session?.user);

  const drawer = (
    <Box display="flex" flexDirection="column" height="100%">
      <Toolbar>
        <Stack alignItems="center" direction="row" spacing={1.5}>
          <Avatar sx={{ bgcolor: "secondary.main", height: 34, width: 34 }}>D</Avatar>
          <Typography fontWeight={700} variant="h6">
            DynaMonitor
          </Typography>
        </Stack>
      </Toolbar>
      <Divider />
      <List component="nav" sx={{ flex: 1, px: 1.5, py: 2 }}>
        {navigation.map((item) => (
          <ListItemButton
            component={NavLink}
            key={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: 1.5,
              mb: 0.5,
              "&.active": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "& .MuiListItemIcon-root": { color: "inherit" },
              },
            }}
            to={item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box p={2}>
        <Typography color="text.secondary" noWrap variant="caption">
          Signed in as
        </Typography>
        <Typography noWrap variant="body2">
          {user?.email}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box display="flex" minHeight="100vh">
      <AppBar
        color="inherit"
        elevation={0}
        position="fixed"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          ml: { md: `${drawerWidth}px` },
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar>
          <IconButton
            aria-label="Open navigation"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: "none" }, mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography color="text.secondary" flex={1} variant="body2">
            Asset condition monitoring
          </Typography>
          <Tooltip title="Sign out">
            <IconButton aria-label="Sign out" onClick={() => void dispatch(logout())}>
              <LogoutOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box component="nav" flexShrink={{ md: 0 }} width={{ md: drawerWidth }}>
        <Drawer
          ModalProps={{ keepMounted: true }}
          onClose={() => setMobileOpen(false)}
          open={mobileOpen}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
          variant="temporary"
        >
          {drawer}
        </Drawer>
        <Drawer
          open={isDesktop}
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
          variant="permanent"
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        flex={1}
        minWidth={0}
        px={{ xs: 2, sm: 3, lg: 4 }}
        py={{ xs: 3, md: 4 }}
      >
        <Toolbar />
        <Box margin="0 auto" maxWidth={1280}>
          <Outlet />
        </Box>
      </Box>
      <AppSnackbar />
    </Box>
  );
}
