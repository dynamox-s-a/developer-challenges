import ThemeRegistry from "@/components/auth/ThemeRegistry";
import Sidebar from "@/components/dashboard/sidebar";
import { AppBar, Box, CssBaseline, Toolbar, Typography } from "@mui/material";

export default function dashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeRegistry>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Sidebar />
          <Typography variant="h6" noWrap component="div">
            Sensory Application
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, mt: 8 }}
      >
        {children}
      </Box>
    </Box>
    </ThemeRegistry>
  );
}
