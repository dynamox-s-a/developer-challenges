import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { isNavItemActive } from "./is-nav-item-active";
import { navItems } from "./nav-config";

export interface NavListProps {
  /** Called after a navigation item is clicked (closes the mobile drawer). */
  onNavigate?: () => void;
}

/**
 * Vertical navigation shared by the desktop sidebar and the mobile drawer.
 *
 * Styling follows the Devias template nav items, with the CSS variables
 * replaced by theme values (MUI 5 has no `--mui-palette-*`).
 */
export function NavList({ onNavigate }: NavListProps) {
  const { pathname } = useLocation();

  return (
    <Box component="nav" sx={{ flex: "1 1 auto", p: 1.5 }}>
      <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
        {navItems.map((item) => {
          const active = isNavItemActive(item.href, pathname);

          return (
            <li key={item.key}>
              <Box
                component={RouterLink}
                to={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                sx={{
                  alignItems: "center",
                  borderRadius: 1,
                  color: active ? "primary.contrastText" : "neutral.300",
                  bgcolor: active ? "primary.main" : "transparent",
                  display: "flex",
                  gap: 1,
                  p: "6px 16px",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    bgcolor: active ? "primary.main" : "rgba(255,255,255,0.04)",
                  },
                }}
              >
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    color: active ? "inherit" : "neutral.400",
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  component="span"
                  sx={{
                    color: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    lineHeight: "28px",
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
            </li>
          );
        })}
      </Stack>
    </Box>
  );
}
