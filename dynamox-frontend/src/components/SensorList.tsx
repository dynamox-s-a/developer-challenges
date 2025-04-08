import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { deleteSensor, fetchSensors } from "../store/sensors/sensorThunks";
import { Sensor } from "../store/sensors/sensorTypes";
import { useEffect, useState } from "react";
import SensorForm from "./SensorForm";

const SensorList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sensors, status } = useSelector((state: RootState) => state.sensors);
  const [editingSensor, setEditingSensor] = useState<Sensor | null>(null);

  useEffect(() => {
    dispatch(fetchSensors());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteSensor(id));
  };

  const handleEdit = (sensor: Sensor) => {
    setEditingSensor(sensor);
  };

  const handleFinishEdit = () => {
    setEditingSensor(null);
  };

  if (status === "loading") return <p>Carregando sensores...</p>;

  return (
    <>
      <SensorForm editingSensor={editingSensor!} onFinishEdit={handleFinishEdit} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Ponto de Monitoramento</TableCell>
              <TableCell>Máquina</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sensors.map((sensor) => (
              <TableRow key={sensor.id}>
                <TableCell>{sensor.name}</TableCell>
                <TableCell>{sensor.model}</TableCell>
                <TableCell>{sensor.monitoringPoint?.machine?.name || "-"}</TableCell>
                <TableCell>{sensor.monitoringPoint?.name || "-"}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEdit(sensor)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(sensor.id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SensorList;
