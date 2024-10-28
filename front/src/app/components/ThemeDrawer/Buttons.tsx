import { IconButton, alpha, useTheme } from "@mui/material";
import React from "react";
import Iconify from "../Iconify/Iconify";

export type actionButton = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  anchor: string;
};

const Buttons = (props: actionButton) => {
  const theme = useTheme();
  return (
    <IconButton
      aria-label="button"
      onClick={props.onClick}
      sx={{
        zIndex: 1,
        ":hover": {
          color: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.15),
          transform: "scale(1.1)",
          transition: "0.5s",
        },
        color: theme.palette.text.primary,
        transition: "0.5s",
        width: "85%",
        height: "8%",
        margin: "10%",
      }}
    >
      <Iconify
        icon={"eva:options-2-fill"}
        width={{ xs: 28, md: 20, lg: 20, xl: 22 }}
        height={{ xs: 20, md: 20, lg: 20, xl: 24 }}
      >
        {props.anchor}
      </Iconify>
    </IconButton>
  );
};

export default Buttons;
