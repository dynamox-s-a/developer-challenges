import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Iconify from "../Iconify/Iconify";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import menuItems from "./Routes";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function MenuTop() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const router = useRouter();
  const pathName = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogOff = () => {
    localStorage.removeItem("token");
    router.replace("routes/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ bgcolor: "#274375" }} open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <Iconify icon={"material-symbols:menu-rounded"} />
          </IconButton>

          <Typography variant="h6" noWrap component="div"></Typography>
          <Box sx={{ ml: "auto" }}>
            <IconButton
              size="large"
              aria-label="settings"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleLogOff}
              sx={{
                fontSize: "1.2rem",
                color: "white",
                transition: "transform 0.2s ease-in-out",
                ":hover": {
                  transform: "scale(1.1)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
            >
              <Iconify icon={"el:off"} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Box width={"100%"} display="flex" justifyContent="center" p={2}>
            <img src="/logo.png" alt="Logo" height="50" width="80" />
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {
              <Iconify
                icon={
                  theme.direction === "ltr"
                    ? "material-symbols:chevron-left"
                    : "material-symbols:chevron-right"
                }
              />
            }
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <>
              {item.divider ? (
                <Divider key={`divider-${index}`} />
              ) : (
                <ListItem key={item.key} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      item.key == "sair"
                        ? handleLogOff()
                        : router.push(`${item.key}`);
                    }}
                    sx={{
                      transition: "transform 0.2s ease-in-out",
                      bgcolor: pathName === item.key ? "#274375" : "inherit",
                      "&:hover": {
                        ":hover": {
                          transform: "scale(1.05)",
                          transition: "transform 0.2s ease-in-out",
                        },
                        bgcolor:
                          pathName === item.key
                            ? "#2c45b2"
                            : "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: pathName === item.key ? "white" : "#274375",
                        minWidth: "25px",
                      }}
                    >
                      <Iconify
                        icon={item && item.icon == undefined ? "" : item.icon}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        "& .MuiTypography-root": {
                          fontSize: 14,
                          color: pathName === item.key ? "white" : "black",
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
