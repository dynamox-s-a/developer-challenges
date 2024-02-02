import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { changeAxis, selectAxis } from "../features/axis/axisSlice"
import { StyledToggleButton } from "./StyledToggleButton"

export const ToggleAxis = () => {
  const axis = useAppSelector(selectAxis)
  const dispatch = useAppDispatch()
  const toggleButtonStyles = { color: "black", background: "white" }

  return (
    <Box
      sx={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingY: "1em",
      }}
    >
      <Typography>Axis:</Typography>
      <ToggleButtonGroup
        value={axis}
        exclusive
        onChange={(event, value) => dispatch(changeAxis(value))}
        aria-label="text alignment"
      >
        <StyledToggleButton
          sx={toggleButtonStyles}
          value="x"
          aria-label="x axis"
        >
          X
        </StyledToggleButton>
        <StyledToggleButton
          sx={toggleButtonStyles}
          value="y"
          aria-label="y axis"
        >
          Y
        </StyledToggleButton>
        <StyledToggleButton
          sx={toggleButtonStyles}
          value="z"
          aria-label="z axis"
        >
          Z
        </StyledToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}
