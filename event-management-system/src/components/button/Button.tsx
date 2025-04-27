"use client";

import React from "react";
import { Button as MuiButton } from "@mui/material";

interface ButtonProps {
  isSubmitting: boolean;
}

const Button: React.FC<ButtonProps> = ({ isSubmitting }) => {
  return (
    <MuiButton
      type="submit"
      variant="contained"
      color="primary"
      disabled={isSubmitting}
      sx={{
        width: "300px",
        height: "48px",
        fontWeight: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: "16px",
      }}
    >
      {isSubmitting ? "Enviando..." : "Login"}
    </MuiButton>
  );
};

export default Button;
