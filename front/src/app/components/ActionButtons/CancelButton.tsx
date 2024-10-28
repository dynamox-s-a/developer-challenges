import { IconButton, alpha, useTheme } from "@mui/material";

import React from "react";
import Iconify from "../Iconify/Iconify";

export type IProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
};

const CancelButton = ({ onClick, title }: IProps) => {
  const theme = useTheme();
  return (
    <>
      <IconButton
        sx={{
          ":hover": {
            backgroundColor: "transparent",
            transition: "transform 0.5s",
          },
          transition: "transform 0.5s",
          color: theme.palette.text.primary,
          borderRadius: 50,
        }}
        aria-haspopup="true"
        onClick={onClick}
        title={title}
      >
        <Iconify
          icon={"material-symbols:cancel"}
          sx={{
            borderRadius: 20,
            color: alpha(theme.palette.error.main, 0.8),
            ":hover": {
              transform: "scale(1.2)",
              transition: "transform 0.3s",
              color: alpha(theme.palette.error.main, 1),
              boxShadow: `0px 1px 5px 2px ${alpha(
                theme.palette.primary.main,
                0.09
              )}`,
            },
            transition: "transform 0.5s",
          }}
        />
      </IconButton>
    </>
  );
};

export default CancelButton;
