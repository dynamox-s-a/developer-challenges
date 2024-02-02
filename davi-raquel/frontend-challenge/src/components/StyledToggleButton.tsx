import { ToggleButton, styled } from "@mui/material"

export const StyledToggleButton = styled(ToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "white",
    backgroundColor: "gray",
  },
  "&:hover": {
    backgroundColor: "white",
  },
})
