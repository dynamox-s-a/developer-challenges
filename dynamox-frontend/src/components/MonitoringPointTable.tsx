import { MonitoringPoint } from "../store/monitoring-point/monitoringPointTypes";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
} from "@mui/material";

interface Props {
  points: MonitoringPoint[];
}

const MonitoringPointTable = ({ points }: Props) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome do Ponto</TableCell>
            <TableCell>Nome da Máquina</TableCell>
            <TableCell>Tipo da Máquina</TableCell>
            <TableCell>Modelo do Sensor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {points.map((point) => (
            <TableRow key={point.id}>
              <TableCell>{point.name}</TableCell>
              <TableCell>{point.machine?.name}</TableCell>
              <TableCell>{point.machine?.type}</TableCell>
              <TableCell>{point.sensor?.model}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MonitoringPointTable;
