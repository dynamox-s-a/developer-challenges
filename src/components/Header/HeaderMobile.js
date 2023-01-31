import * as React from "react";
import Image from "next/image";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Link,
  IconButton,
  Menu,
  MenuItem,
  StyledEngineProvider,
  styled,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Container } from "./styles";
import logo from "@/assets/images/logo-dynamox.png";

export default function HeaderMobile({ pageRef }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

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
