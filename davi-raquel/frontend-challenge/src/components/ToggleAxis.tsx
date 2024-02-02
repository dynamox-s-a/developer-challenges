import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { changeAxis, selectAxis } from "../features/axis/axisSlice"

export const ToggleAxis = () => {
  const axis = useAppSelector(selectAxis)
  const dispatch = useAppDispatch()
  return (
    <Box>
      <Typography>Select axis:</Typography>
      <ToggleButtonGroup
        value={axis}
        exclusive
        onChange={(event, value) => dispatch(changeAxis(value))}
        aria-label="text alignment"
      >
        <ToggleButton value="x" aria-label="x axis">
          X
        </ToggleButton>
        <ToggleButton value="y" aria-label="y axis">
          Y
        </ToggleButton>
        <ToggleButton value="z" aria-label="z axis">
          Z
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}
