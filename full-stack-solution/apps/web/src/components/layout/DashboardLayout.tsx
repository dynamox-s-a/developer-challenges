import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";
import { AppSnackbar } from "@web/components/common/AppSnackbar";
import { MainNav } from "./MainNav";
import { SIDE_NAV_WIDTH, SideNav } from "./SideNav";

/**
 * Private area shell: fixed sidebar on large screens, top bar with a drawer on
 * small ones. Structure adapted from the Devias dashboard layout (MIT).
 */
export function DashboardLayout() {
  return (
    <Box
      sx={{
        bgcolor: "background.level1",
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
      }}
    >
      <SideNav />
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          pl: { lg: `${SIDE_NAV_WIDTH}px` },
        }}
      >
        <MainNav />
        <Box component="main" sx={{ flex: "1 1 auto" }}>
          <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
            <Outlet />
          </Container>
        </Box>
      </Box>
      <AppSnackbar />
    </Box>
  );
}
