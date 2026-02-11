import ThemeRegistry from "@/components/auth/ThemeRegistry";
import { AuroraText } from "@/components/ui/aurora-text";
import Sidebar from "@/components/ui/sidebar";
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
          <Typography variant="h6" noWrap component="div" className="font-bold tracking-tighter">
            Sensory <AuroraText>Application</AuroraText> 
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
