import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { paths } from "@web/routes/paths";
import { Logo } from "./Logo";
import { NavList } from "./NavList";

export const SIDE_NAV_WIDTH = 280;

/**
 * Permanent sidebar, hidden below the `lg` breakpoint where the mobile drawer
 * takes over.
 */
export function SideNav() {
  return (
    <Box
      component="aside"
      sx={{
        bgcolor: "neutral.950",
        color: "common.white",
        display: { xs: "none", lg: "flex" },
        flexDirection: "column",
        height: "100%",
        left: 0,
        position: "fixed",
        top: 0,
        width: SIDE_NAV_WIDTH,
        zIndex: (theme) => theme.zIndex.appBar + 100,
        overflowY: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box
          component={RouterLink}
          to={paths.overview}
          sx={{ display: "inline-flex", textDecoration: "none" }}
        >
          <Logo />
        </Box>
      </Stack>
      <Divider sx={{ borderColor: "neutral.700" }} />
      <NavList />
      <Divider sx={{ borderColor: "neutral.700" }} />
      <Box sx={{ p: 2 }}>
        <Typography color="neutral.400" variant="caption">
          Asset condition monitoring
        </Typography>
      </Box>
    </Box>
  );
}
