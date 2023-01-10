import React from "react";
import {
  Box,
  // Container,
  Typography,
  Button,
  InputBase,
  // TextField,
} from "@mui/material";
import "./login.css";

export default function Login(): JSX.Element {
  return (
    <Box component="section" sx={{ width: "100vw", height: "100vh" }}>
      <Box className="loginBox">
        <Typography variant="h4" component="h1">
          Seja bem-vindo!
        </Typography>

        <Box component="form" className="formBox">
          <InputBase placeholder="Email" type="text" className="loginInput" />

          <InputBase
            placeholder="Password"
            type="text"
            className="loginInput"
          />
          <Button variant="contained">Entrar</Button>
        </Box>
      </Box>
    </Box>
  );
}
