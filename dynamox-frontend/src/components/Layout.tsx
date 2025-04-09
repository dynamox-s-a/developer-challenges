import React from "react";
import { AppBar, Toolbar, Box, Container, Button, Stack } from "@mui/material";
import LogoutButton from "./LogoutButton";
import { Link as RouterLink } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#000" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Stack direction="row" spacing={2}>
            <Button component={RouterLink} to="/monitoring-points" color="inherit">
              Pontos de Monitoramento
            </Button>
            <Button component={RouterLink} to="/machines" color="inherit">
              Máquinas
            </Button>
          </Stack>

          <LogoutButton />
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 4 }}>{children}</Container>
    </Box>
  );
};

export default Layout;
