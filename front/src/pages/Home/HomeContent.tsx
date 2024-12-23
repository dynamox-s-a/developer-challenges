import { 
  Box,
  Button,
  Card,
  IconButton,
  Typography
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { MainContainer } from "../Login/styles"
import { Delete, Edit } from "@mui/icons-material"
import { useHomeContext } from "./hooks/useHomeContext"
import { Snackbar, Table } from "../../components"
import { FlexVertical } from "../../components/FlexVertical"

export const HomeContent = () => {
  const navigate = useNavigate()

  const { 
    machines, 
    points, 
    openSnackbar,
    onEditMachine, 
    onDeleteMachine, 
    onEditPoint,
    onDeletePoint,
    handleCloseSnackbar
  } = useHomeContext()
  
  return (
    <MainContainer  direction="row">
      <Box sx={{ width: '100vw' }}>
        <FlexVertical 
          style={{ 
            gap: 8,
            padding: 8 
          }}
        >
          <Card sx={{ padding: 2 }}>
            <FlexVertical style={{ gap: 16 }}>
              <FlexVertical style={{ gap: 16 }}>
                <Typography variant="h6" gutterBottom>
                  Máquinas
                </Typography>
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={() => navigate('/machines/create')}
                  >
                    Adicionar Máquina
                  </Button>
                </div>
                <Table
                  dataSource={machines}
                  columns={[
                    { label: 'ID', key: 'id' },
                    { label: 'Nome', key: 'name' },
                    { label: 'Tipo', key: 'type' },
                    { label: 'Qtde. Pontos', key: 'totalpoints' },
                    { label: 'Qtde. Sensores', key: 'totalsensors' }
                  ]}
                  actionColumn={(machineId: number, machine) => {
                    return (
                      <>
                        <IconButton
                          color="primary"
                          sx={{ margin: '0px 1px' }}
                          onClick={() => onEditMachine(machineId)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          disabled={machine.totalpoints > 0}
                          sx={{ margin:  '1px 0px' }}
                          onClick={() => onDeleteMachine(machineId)}
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )
                  }}
                />
              </FlexVertical>
              <div>
                <Typography variant="h6" gutterBottom>
                  Pontos de Monitoramento
                </Typography>
                <Table
                  dataSource={points}
                  columns={[
                    { label: 'ID', key: 'point_id' },
                    { label: 'Nome', key: 'point_name' },
                    { label: 'Nome Máquina', key: 'machine_name' },
                    { label: 'Tipo Máquina', key: 'machine_type' },
                    { label: 'Modelos Sensores', key: 'sensors' }
                  ]}
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
                          disabled={item.sensors}
                          sx={{ margin:  '1px 0px' }}
                          onClick={() => onDeletePoint(pointId)}
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )
                  }}
                />
              </div>
            </FlexVertical>
          </Card>
        </FlexVertical>
      </Box>
      <Snackbar
        snackbar={openSnackbar}
        onClose={handleCloseSnackbar}
      />
    </MainContainer>
  )
}
