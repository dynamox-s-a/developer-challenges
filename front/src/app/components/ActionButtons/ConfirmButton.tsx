import { IconButton, alpha, useTheme } from "@mui/material";

import React from "react";
import Iconify from "../Iconify/Iconify";

export type IProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
};

const ConfirmButton = ({ onClick, title }: IProps) => {
  const theme = useTheme();
  return (
    <>
      <IconButton
        type={"submit"}
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
        title={title}
        onClick={onClick}
      >
        <Iconify
          icon={"material-symbols:done"}
          sx={{
            borderRadius: 20,
            color: alpha(theme.palette.success.main, 0.8),
            ":hover": {
              transform: "scale(1.2)",
              transition: "transform 0.3s",
              color: alpha(theme.palette.success.main, 1),
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

export default ConfirmButton;
