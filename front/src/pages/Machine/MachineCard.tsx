import { 
  TextField, 
  Button,
  FormControl,
  Typography,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  IconButton,
  InputLabel
} from "@mui/material"
import { useMachineContext } from "./hooks/useMachineContext"
import { useNavigate, useParams } from "react-router-dom"
import { MainContainer } from "../Login/styles"
import { Card, Snackbar, Table } from '../../components'
import { Delete, Edit } from "@mui/icons-material"
import { FlexVertical } from "../../components/FlexVertical"
import { LoadingSpinner } from "../../components/LoadingSpinner"

export const MachineCard = () => {
  const navigate = useNavigate()
  const { id: idMachine } = useParams<{ id: string }>()

  const { 
    loading,
    handleSubmit,
    submitDisabled,
    openSnackbar,
    machine,
    points,
    nameError,
    machineTypeError,
    handleNameChange,
    handleMachineTypeChange,
    handleCloseSnackbar,
    onDeleteMachine,
    onEditPoint,
    onDeletePoint
  } = useMachineContext()

  if (loading) return <LoadingSpinner />

  return (
    <MainContainer
      direction="column" 
      justifyContent="center" 
      alignItems="center"
    >
      <Card onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          {idMachine ? 'Editar Máquina' : 'Cadastrar Máquina'}
        </Typography>
        <FormControl>
          <TextField
            error={nameError?.alreadyFilled && nameError?.visible}
            helperText={nameError?.message}
            value={machine?.name}
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
        <FormControl error={machineTypeError?.alreadyFilled && machineTypeError?.visible}>
          <InputLabel id="machine-type-label">Selecione o tipo de máquina *</InputLabel>
          <Select
            label="Selecione o tipo de máquina"
            labelId="machine-type-label"
            value={machine?.type || ''}
            onChange={handleMachineTypeChange}
            displayEmpty
            variant="outlined"
            required
          >
            <MenuItem value="" disabled>
              Selecione o tipo de máquina
            </MenuItem>
            <MenuItem value="Pump">
              Pump
            </MenuItem>
            <MenuItem value="Fan">
              Fan
            </MenuItem>
          </Select>
          {machineTypeError?.visible && (<FormHelperText>Por favor, selecione o tipo de máquina.</FormHelperText>)}
        </FormControl>
        <div>
          <FlexVertical style={{ gap: 16 }}>
            <Divider />
            <Typography variant="h6" gutterBottom>
              Pontos de Monitoramento
            </Typography>
            <div>
              <Button
                variant="contained"
                onClick={() => navigate('/points/create')}
                disabled={!idMachine}
              >
                Adicionar Ponto
              </Button>
            </div>
            <Table
              dataSource={points}
              columns={['ID', 'Nome', 'Qtde. Sensores']}
              actionColumn={(pointId: number, item) => {
                return (
                  <>
                    <IconButton
                      color="primary"
                      sx={{ margin: '0px 1px' }}
                      onClick={() => onEditPoint(pointId)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      disabled={item.totalSensors > 0}
                      sx={{ margin:  '1px 0px' }}
                      onClick={() => onDeletePoint(pointId)}
                    >
                      <Delete />
                    </IconButton>
                  </>
                )
              }}
            />
            <Divider />
          </FlexVertical>
        </div>
        <div>
          <Button
            type="submit"
            variant="contained"
            disabled={submitDisabled}
            sx={{ marginRight: 1 }}
          >
            {idMachine ? 'Confirmar' : 'Cadastrar'}
          </Button>
          {idMachine && (
            <Button
              variant="contained"
              color="error"
              sx={{ marginLeft: 1 }}
              disabled={points.length > 0}
              onClick={onDeleteMachine}
            >
              Excluir Máquina
            </Button>
          )}
        </div>
        <div>
          <Button
            variant="contained"
            onClick={() => navigate('/home')}
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
