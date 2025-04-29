import { IconButton as MuiIconButton, IconButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledIconButton = styled(MuiIconButton)(() => ({
  width: "50%",
  background: "none",
  border: "none",
  padding: "0.5rem",
  cursor: "pointer",
  "&:hover": {
    background: "transparent",
  },
  "&:active": {
    background: "transparent",
    transform: "none",
    boxShadow: "none",
  },
  "& .MuiTouchRipple-root": {
    display: "none",
  },
}));

const IconButton = (props: IconButtonProps) => {
  return <StyledIconButton disableRipple {...props} />;
};

export default IconButton;
