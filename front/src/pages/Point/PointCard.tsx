import { 
  TextField, 
  Button,
  FormControl,
  Typography,
  Divider,
  IconButton
} from "@mui/material"
import { usePointContext } from "./hooks/usePointContext"
import { useNavigate, useParams } from "react-router-dom"
import { SignInContainer } from "../Login/styles"
import { Card, Snackbar, Table } from '../../components'
import { Delete } from "@mui/icons-material"

export const PointCard = () => {
  const navigate = useNavigate()
  const { id: idPoint } = useParams<{ id: string }>()

  const { 
    handleSubmit,
    submitDisabled,
    openSnackbar,
    point,
    sensors,
    nameError,
    handleNameChange,
    handleCloseSnackbar,
    onDeleteSensor
  } = usePointContext()

  return (
    <SignInContainer
      direction="column" 
      justifyContent="center" 
      alignItems="center"
    >
      <Card onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          {idPoint ? 'Editar Ponto de Monitoramento' : 'Cadastrar Ponto de Monitoramento'}
        </Typography>
        <FormControl>
          <TextField
            error={nameError?.alreadyFilled && nameError?.visible}
            helperText={nameError?.message}
            value={point?.name}
            onChange={handleNameChange}
            label="Nome"
            name="name"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={nameError?.visible ? 'error' : 'primary'}
          />
        </FormControl>
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Divider />
            <Typography variant="h6" gutterBottom>
              Sensores
            </Typography>
            <div>
              <Button
                variant="contained"
                onClick={() => navigate('/sensors/create')}
              >
                Adicionar Sensor
              </Button>
            </div>
            <Table
              dataSource={sensors}
              columns={['ID', 'Nome']}
              actionColumn={(sensorId: number, item) => {
                return (
                  <IconButton
                    color="error"
                    disabled={item.totalSensors > 0}
                    sx={{ margin:  '1px 0px' }}
                    onClick={() => onDeleteSensor(sensorId)}
                  >
                    <Delete />
                  </IconButton>
                )
              }}
            />
            <Divider />
          </div>
        </div>
        <div>
          <Button
            type="submit"
            variant="contained"
            disabled={submitDisabled}
            sx={{ marginRight: 1 }}
          >
            {idPoint ? 'Confirmar' : 'Cadastrar'}
          </Button>
          {idPoint && (
            <Button
              variant="contained"
              color="error"
              sx={{ marginLeft: 1 }}
              disabled={sensors.length > 0}
            >
              Excluir Ponto
            </Button>
          )}
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
