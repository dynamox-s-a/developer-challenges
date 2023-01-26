import * as React from "react";
import Image from "next/image";
import logo from "@/assets/images/logo-dynamox.png";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { StyledEngineProvider } from "@mui/material/styles";
import { Container } from "./styles";
import { styled } from "@mui/material/styles";

export default function HeaderMobile({ pageRef }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // function scrollSensor() {
  //   handleCloseMenu;
  //   pageRef[0].current.scrollIntoView({
  //     behavior: "smooth",
  //   });
  // }

  return (
    <StyledEngineProvider injectFirst>
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <StyledAppBar position="static" elevation={0}>
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
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={handleOpenMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem
                  key="dynapredict"
                  onClick={() => {
                    window.location = "https://dynamox.net/dynapredict/";
                  }}
                >
                  DynaPredict
                </MenuItem>
                <MenuItem
                  key="sensors"
                  onClick={() => {
                    pageRef[0].current.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  Sensores
                </MenuItem>
                <MenuItem
                  key="contact"
                  onClick={() => {
                    pageRef[1].current.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  Contato
                </MenuItem>
              </Menu>
            </Toolbar>
          </StyledAppBar>
        </Box>
      </Container>
    </StyledEngineProvider>
  );
}

const StyledAppBar = styled(AppBar)`
  background-color: #263252;
  height: 60px;
`;
