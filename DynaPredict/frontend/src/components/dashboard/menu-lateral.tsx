import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import {
  AppBar,
  Avatar,
  Divider,
  Drawer,
  Icon,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const DRAWER_WIDTH = 28 * 8; // theme.spacing(28)

export function MenuLateral({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box
        width="100%"
        height={theme.spacing(20)}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Avatar
          sx={{ height: theme.spacing(12), width: theme.spacing(12) }}
          src="https://yt3.ggpht.com/grfYgQadT8iNg9WPb-jkrKB-9224y_DBDXAOtV4Yt7cyQmtR47J_453uveQOTDsp_dRSH851TMM=s108-c-k-c0x00ffffff-no-rj"
        />
      </Box>

      <Divider />

      <Box flex={1}>
        <List component="nav">
          <ListItemButton>
            <ListItemIcon>
              <Icon>home</Icon>
            </ListItemIcon>
            <ListItemText primary="Página inicial" />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <Icon>menu</Icon>
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {isMdUp ? (
          <Drawer
            variant="permanent"
            sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar /> {/* Espaçador para o conteúdo não ficar atrás do AppBar */}
        {children}
      </Box>
    </>
  );
}
