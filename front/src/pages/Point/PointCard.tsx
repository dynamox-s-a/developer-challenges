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
import { MainContainer } from "../Login/styles"
import { Card, Snackbar, Table } from '../../components'
import { Delete } from "@mui/icons-material"
import { FlexVertical } from "../../components/FlexVertical"
import { MachineReduxState } from "../../redux"
import { useSelector } from "react-redux"
import { LoadingSpinner } from "../../components/LoadingSpinner"

export const PointCard = () => {
  const navigate = useNavigate()

  const { id: idPoint } = useParams<{ id: string }>()
  const machineId = useSelector((state: { machine: MachineReduxState }) => state.machine)?.id

  const { 
    loading,
    handleSubmit,
    submitDisabled,
    openSnackbar,
    point,
    sensors,
    nameError,
    handleNameChange,
    handleCloseSnackbar,
    onDeletePoint,
    onDeleteSensor
  } = usePointContext()

  if (loading) return <LoadingSpinner />

  return (
    <MainContainer
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
            InputLabelProps={{
              shrink: true
            }}
          />
        </FormControl>
        <div>
          <Button
            type="submit"
            variant="contained"
            disabled={submitDisabled}
          >
            {idPoint ? 'Alterar' : 'Cadastrar'}
          </Button>
        </div>
        <div>
          <FlexVertical style={{ gap: 16 }}>
            <Divider />
            <Typography variant="h6" gutterBottom>
              Sensores
            </Typography>
            <div>
              <Button
                variant="contained"
                onClick={() => navigate('/sensors/create')}
                disabled={!idPoint}
              >
                Adicionar Sensor
              </Button>
            </div>
            <Table
              dataSource={sensors}
              columns={[
                { label: 'ID', key: 'id' },
                { label: 'Nome', key: 'type' }
              ]}
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
          </FlexVertical>
        </div>
        <div>
          {idPoint && (
            <Button
              variant="contained"
              color="error"
              sx={{ marginRight: 1 }}
              disabled={sensors.length > 0}
              onClick={onDeletePoint}
            >
              Excluir Ponto
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => navigate(`/machines/edit/${machineId}`)}
            sx={{ marginLeft: 1 }}
          >
            Voltar
          </Button>
        </div>
      </Card>
      <Snackbar
        snackbar={openSnackbar}
        onClose={handleCloseSnackbar}
      />
    </MainContainer>
  )
}
