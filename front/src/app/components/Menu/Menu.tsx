import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  alpha,
} from "@mui/material";
import { useState } from "react";
import Iconify from "../Iconify/Iconify";
import { usePathname, useRouter } from "next/navigation";
import menuItems from "./Routes";

export default function Menux() {
  const router = useRouter();
  const pathName = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOff = () => {
    localStorage.removeItem("token");
    router.replace("routes/login");
  };

  const theme = useTheme();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        sx={{ bgcolor: theme.palette.primary.dark, boxShadow: "none" }}
        position="static"
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{
                color: "white",
                transition: "transform 0.2s ease-in-out",
                ":hover": {
                  transform: "scale(1.1)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
            >
              <Iconify icon={"material-symbols:account-circle"} />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogOff}>Disconnect</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          bgcolor: alpha(theme.palette.primary.dark, 0.9),
          width: 2020,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 220,
            boxSizing: "border-box",
            bgcolor: alpha(theme.palette.primary.dark, 0.9),
            boxShadow: 4,
            overflowX: "hidden",
          },
          "& .MuiToolbar-root": {
            bgcolor: alpha(theme.palette.primary.dark, 0.9),
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Box display="flex" justifyContent="start" p={2}>
            <img
              onClick={() => router.push("/routes/home")}
              src="/logo.png"
              style={{ cursor: "pointer" }}
              alt="Logo"
              height="50"
              width="120"
            />
          </Box>
        </Toolbar>
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
                      item.label == "Log-off"
                        ? handleLogOff()
                        : router.push(`${item.key}`);
                    }}
                    sx={{
                      transition: "transform 0.2s ease-in-out",
                      bgcolor:
                        pathName === item.key
                          ? theme.palette.primary.light
                          : "inherit",
                      "&:hover": {
                        ":hover": {
                          transform: "scale(1.05)",
                          transition: "transform 0.2s ease-in-out",
                        },
                        bgcolor:
                          pathName === item.key
                            ? theme.palette.primary.darker
                            : "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: theme.palette.primary.contrastText,
                        minWidth: "32px",
                      }}
                    >
                      <Iconify
                        fontSize={25}
                        icon={item && item.icon == undefined ? "" : item.icon}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        "& .MuiTypography-root": {
                          fontSize: 16,
                          color: theme.palette.primary.contrastText,
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
