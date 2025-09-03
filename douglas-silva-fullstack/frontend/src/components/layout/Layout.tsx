import { Box, CssBaseline, Toolbar } from "@mui/material";
import { useState } from "react";
import type { ReactNode } from "react";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const drawerWidth = 240;

const Layout = ({ children }: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 0,
          pt: 0,
          pb: 0,
          pl: 2,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
