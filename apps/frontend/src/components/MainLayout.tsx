import React, { ReactNode } from "react";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./Sidebar"; // Importe o seu componente Sidebar

interface MainLayoutProps {
  children: ReactNode; // Define o tipo do children
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />
      <Sidebar />
      {/* Adicionando paddingTop para ajustar o AppBar nas telas menores */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          paddingTop: { xs: '64px', sm: '24px' }, // Espaçamento para mobile e desktop 
          overflowY: "auto" 
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
