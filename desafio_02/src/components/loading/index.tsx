import React from "react";
import { CircularProgress, Box } from "@mui/material";
import "./loading.css";

export default function Loading(): JSX.Element {
  return (
    <Box className="loadingBox">
      <CircularProgress />
    </Box>
  );
}
