import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import { Grid } from "@mui/material";

function Navbar() {

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Grid container>
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Produtos |
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }} >
              <Typography
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
                component="a"
                href="/criar"
              >
                Criar Produtos
              </Typography>
            </Box>

          </Toolbar>
        </Grid>

      </Container>
    </AppBar>
  );
}
export default Navbar;