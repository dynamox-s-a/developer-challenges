"use client";

import React from "react";
import { Button, Box } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const SortBar = ({
  sortByName,
  sortByDate,
}: {
  sortByName: () => void;
  sortByDate: () => void;
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          zIndex: 3,
        }}
      >
        <Button
          variant="contained"
          onClick={sortByName}
          startIcon={<ArrowDownwardIcon />}
          sx={{
            backgroundColor: "transparent",
            color: "#fff",
            width: "100%",
            fontSize: "14px",
            border: "none",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "transparent",
              fontWeight: "bold",
              boxShadow: "none",
            },
            "&:focus": {
              outline: "none",
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            "&:active": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            "& .MuiButton-startIcon": {
              marginRight: "8px",
            },
          }}
        >
          Nome
        </Button>

        <Button
          variant="contained"
          onClick={sortByDate}
          startIcon={<ArrowDownwardIcon />}
          sx={{
            backgroundColor: "transparent",
            color: "#fff",
            width: "100%",
            fontSize: "14px",
            border: "none",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "transparent",
              fontWeight: "bold",
              boxShadow: "none",
            },
            "&:focus": {
              outline: "none",
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            "&:active": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            "& .MuiButton-startIcon": {
              marginRight: "8px",
            },
          }}
        >
          Data
        </Button>
      </div>
    </Box>
  );
};

export default SortBar;
