"use client";

import { Box, TextField, Button, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loginHandle(e: React.FormEvent) {
    e.preventDefault();
    return
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: 450 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "50%",
            maxWidth: 300,
            mb: 4,
          }}
        >
          <Image
            src="/icons/Dynamox-logo.png"
            alt="Logo"
            width={300}
            height={300}
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </Box>

        {/* Formulário */}
        <Box
          component="form"
          onSubmit={loginHandle}
          sx={{
            width: "100%",
            p: { xs: 3, sm: 6 },
            borderRadius: 3,
            boxShadow: 5,
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography variant="h4" textAlign="center">
            User Login
          </Typography>

          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="contained" color="primary" size="large">
            Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
