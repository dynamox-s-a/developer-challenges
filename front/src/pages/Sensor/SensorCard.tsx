import {
  Button,
  FormControl,
  Typography,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel
} from "@mui/material"
import { useSensorContext } from "./hooks/useSensorContext"
import { useNavigate } from "react-router-dom"
import { SignInContainer } from "../Login/styles"
import { Card, Snackbar } from '../../components'

export const SensorCard = () => {
  const navigate = useNavigate()

  const { 
    handleSubmit,
    submitDisabled,
    openSnackbar,
    sensor,
    modelError,
    handleSensorModelChange,
    handleCloseSnackbar
  } = useSensorContext()

  return (
    <SignInContainer
      direction="column" 
      justifyContent="center" 
      alignItems="center"
    >
      <Card onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Cadastrar Sensor
        </Typography>
        <FormControl error={modelError?.alreadyFilled && modelError?.visible}>
          <InputLabel id="sensor-type-label">Selecione o tipo de sensor *</InputLabel>
          <Select
            label="Selecione o tipo de sensor"
            labelId="sensor-type-label"
            value={sensor.model}
            onChange={handleSensorModelChange}
            displayEmpty
            variant="outlined"
            required
          >
            <MenuItem value="TcAg">
              TcAg
            </MenuItem>
            <MenuItem value="TcAs">
              TcAs
            </MenuItem>
            <MenuItem value="HF+">
              HF+
            </MenuItem>
          </Select>
          {modelError?.visible && (<FormHelperText>Por favor, selecione o tipo de sensor.</FormHelperText>)}
        </FormControl>
        <div>
          <Button
            type="submit"
            variant="contained"
            disabled={submitDisabled}
            sx={{ marginRight: 1 }}
          >
            Confirmar
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
        </div>
      </Card>
      <Snackbar
        snackbar={openSnackbar}
        onClose={handleCloseSnackbar}
      />
    </SignInContainer>
  )
}
