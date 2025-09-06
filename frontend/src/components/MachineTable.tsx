import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import { Edit, Trash, AlertCircle } from "lucide-react";
import { Machine } from "../services/api";

interface MachineTableProps {
  machines: Machine[];
  loading: boolean;
  onEdit: (machine: Machine) => void;
  onDelete: (machine: Machine) => void;
}

export default function MachineTable({
  machines,
  loading,
  onEdit,
  onDelete,
}: MachineTableProps) {
  return (
    <TableContainer component={Paper} elevation={1}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Criado em</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                <CircularProgress size={30} />
              </TableCell>
            </TableRow>
          ) : machines.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <AlertCircle size={24} />
                  <Typography>Nenhuma máquina encontrada</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            machines.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell>{machine.id}</TableCell>
                <TableCell>{machine.name}</TableCell>
                <TableCell>{machine.type}</TableCell>
                <TableCell>
                  {new Date(machine.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(machine)}
                    >
                      <Edit size={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Deletar">
                    <IconButton
                      color="error"
                      onClick={() => onDelete(machine)}
                    >
                      <Trash size={18} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}