import { 
  Box,
  Button,
  Card,
  IconButton,
  Typography
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { SignInContainer } from "../Login/styles"
import { Delete, Edit } from "@mui/icons-material"
import { useHomeContext } from "./hooks/useHomeContext"
import { Table } from "../../components"

export const HomeContent = () => {
  const navigate = useNavigate()

  const { 
    machines, 
    points, 
    onEditMachine, 
    onDeleteMachine, 
    onEditPoint,
    onDeletePoint
  } = useHomeContext()
  
  return (
    <SignInContainer  direction="row">
      <Box
        sx={{
          height: '100vh',
          width: '100vw'
        }}
      >
        <div 
          style={{ 
            display: 'flex',
            flexDirection: 'column', 
            gap: 8, 
            marginTop: 64, 
            padding: 8 
          }}
        >
          <Card sx={{ padding: 2 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
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
                  columns={['ID', 'Nome', 'Tipo', 'Qtde. Pontos', 'Qtde. Sensores']}
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
                          disabled={machine.totalPoints > 0}
                          sx={{ margin:  '1px 0px' }}
                          onClick={() => onDeleteMachine(machineId)}
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )
                  }}
                />
              </div>
              <div>
                <Typography variant="h6" gutterBottom>
                  Pontos de Monitoramento
                </Typography>
                <Table
                  dataSource={points}
                  columns={['ID', 'Nome', 'Máquina Vinculada', 'Qtde. Sensores']}
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
              </div>
            </div>
          </Card>
        </div>
      </Box>
    </SignInContainer>
  )
}
