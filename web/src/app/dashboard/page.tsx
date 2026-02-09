import Sidebar from "@/components/dashboard/sidebar";
import { getUserSession } from "@/utils/jwt"
import { AppBar, Box, CssBaseline, Toolbar, Typography } from "@mui/material";
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getUserSession()

  if (!session) {
    redirect('/auth/login')
  }

return (
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
      <Typography paragraph>
        LOL
      </Typography>
    </Box>
  </Box>
);
}