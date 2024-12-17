import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Button,
  Container,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToApp from "@mui/icons-material/ExitToApp";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import LogoDynamox from "@/assets/logo-dynapredict.png";
import Image from "next/image";
import ThemeToggle from "./themeToggle";

const pages = [
  { name: "Home", path: "/" },
  { name: "Machines", path: "/machines" },
  { name: "Monitoring Points", path: "/monitoring-points" },
];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const { data: session } = useSession();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleLogout = () => signOut({ callbackUrl: "/login" });

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo on the left */}
          <Box
            component="a"
            href="/"
            sx={{ mr: 4, display: { xs: "none", md: "flex" } }}
          >
            <Image src={LogoDynamox} alt="Company Logo" />
          </Box>

          {/* Mobile menu button */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              keepMounted
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Link href={page.path} passHref>
                    <Typography sx={{ textAlign: "center" }}>
                      {page.name}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <Box
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Image src={LogoDynamox} alt="Company Logo" />
          </Box>

          {/* Menu items for desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link key={page.name} href={page.path} passHref>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.name}
                </Button>
              </Link>
            ))}
          </Box>

          <ThemeToggle />

          {/* logout */}
          {session && (
            <Box sx={{ flexGrow: 0 }}>
              <IconButton size="large" color="inherit" onClick={handleLogout}>
                <ExitToApp />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
