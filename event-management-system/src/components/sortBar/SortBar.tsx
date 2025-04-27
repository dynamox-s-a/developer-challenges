"use client";

import React from "react";
import { Button, Box } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import styles from "./sortbar.module.css";

const EventGrid = ({
  sortByName,
  sortByDate,
}: {
  sortByName: () => void;
  sortByDate: () => void;
}) => {
  return (
    <Box className={styles.eventsContainer}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: 20,
          zIndex: 3,
        }}
      >
        <Button
          variant="contained"
          onClick={sortByName}
          startIcon={<ArrowUpwardIcon />}
          sx={{
            backgroundColor: "transparent",
            color: "#fff",
            width: "100%",
            fontSize: "14px",
            marginBottom: "16px",
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
          startIcon={<ArrowUpwardIcon />}
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

export default EventGrid;
