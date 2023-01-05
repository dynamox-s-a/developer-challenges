import React from "react";
import "./header.css";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { pages } from "./helper";
import DynamoxLogo from "../../images/logo-dynamox.png";

export default function Header(): JSX.Element {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar className="desktopNavBar">
          <Box
            component="a"
            href="https://dynamox.net/"
            target="_blank"
            title="Soluções de sensoriamento e análise de dados"
            className="logoBox"
          >
            <img
              src={DynamoxLogo}
              alt="Dynamox Logo"
              className="headerLogoImg"
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} className="linkPagesBox">
            {pages.map((page) => (
              <Typography
                key={page.name}
                variant="h6"
                component="a"
                href={page.path}
                title={page.title}
              >
                {page.name}
              </Typography>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
