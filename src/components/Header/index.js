import * as React from "react";
import Image from "next/image";
import logo from "@/assets/images/logo-dynamox.png";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Container } from "./styles";

export default function Header() {
  return (
    <Container>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          style={{
            background: "#263252",
            height: "120px",
          }}
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
              <Link href="#">Sensores</Link>
              <Link href="#">Contato</Link>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </Container>
  );
}
