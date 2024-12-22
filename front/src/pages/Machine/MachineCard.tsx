import { 
  TextField, 
  Button,
  FormControl,
  Typography,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  IconButton
} from "@mui/material"
import { useMachineContext } from "./hooks/useMachineContext"
import { useNavigate, useParams } from "react-router-dom"
import { SignInContainer } from "../Login/styles"
import { Card, Snackbar, Table } from '../../components'
import { Delete, Edit } from "@mui/icons-material"

export const MachineCard = () => {
  const navigate = useNavigate()
  const { id: idMachine } = useParams<{ id: string }>()

  const { 
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
    onEditPoint,
    onDeletePoint
  } = useMachineContext()

  return (
    <SignInContainer
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
          />
        </FormControl>
        <FormControl error={machineTypeError?.alreadyFilled && machineTypeError?.visible}>
          <Select
            value={machine?.type}
            onChange={handleMachineTypeChange}
            displayEmpty
            variant="outlined"
            required
          >
            <MenuItem value="None" disabled>
              Selecione o Tipo de Máquina
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Divider />
            <Typography variant="h6" gutterBottom>
              Pontos de Monitoramento
            </Typography>
            <div>
              <Button
                variant="contained"
                onClick={() => navigate('/points/create')}
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
          </div>
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
            >
              Excluir Máquina
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
