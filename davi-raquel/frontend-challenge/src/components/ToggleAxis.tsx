import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"

interface IToggleAxis extends React.HTMLAttributes<HTMLSelectElement> {
  axis: string
  handleChange: (event: React.MouseEvent<HTMLElement>, newAxis: string) => void
}

export const ToggleAxis = ({ axis, handleChange }: IToggleAxis) => {
  return (
    <Box>
      <Typography>Select axis:</Typography>
      <ToggleButtonGroup
        value={axis}
        exclusive
        onChange={handleChange}
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
