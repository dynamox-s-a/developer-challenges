import * as React from "react";
import Image from "next/image";
import {AppBar, Box, Toolbar,Typography, Link } from "@mui/material";
import { StyledEngineProvider, styled } from "@mui/material/styles";
import { Container } from "./styles";
import logo from "@/assets/images/logo-dynamox.png";

const StyledAppBar = styled(AppBar)`
  background-color: #263252;
  height: 120px;
`;

export default function HeaderDesktop({pageRef}) {
  return (
    <StyledEngineProvider injectFirst>
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <StyledAppBar
            position="static"
            elevation={0}
          >
            <Toolbar>
              <Typography
                component="div"
                sx={{ flexGrow: 1, mt: "24px", ml: "77px" }}
                style={{
                  justifyContent: "center",
                }}
              >
                <Link href="https://dynamox.net/">
                  <Image src={logo} alt="logo" className="logo" edge="start" />
                </Link>
              </Typography>
              <Box sx={{ mt: "44px" }}>
                <Link href="https://dynamox.net/dynapredict/">DynaPredict</Link>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    pageRef[0].current.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  Sensores
                </Link>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    pageRef[1].current.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  Contato
                </Link>
              </Box>
            </Toolbar>
          </StyledAppBar>
        </Box>
      </Container>
    </StyledEngineProvider>
  );
}
