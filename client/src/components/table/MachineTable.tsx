import React from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Machine {
  _id: string;
  name: string;
  type: 'Pump' | 'Fan';
}

interface MachineTableProps {
  machines: Machine[];
  onEdit: (machine: Machine) => void;
  onDelete: (id: string) => void;
}

export const MachineTable: React.FC<MachineTableProps> = ({ machines, onEdit, onDelete }) => {
  return (
    <Table sx={{ maxWidth: 800 }}>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {machines.map((machine) => (
          <TableRow key={machine._id}>
            <TableCell>{machine.name}</TableCell>
            <TableCell>{machine.type}</TableCell>
            <TableCell align="right">
              <IconButton onClick={() => onEdit(machine)} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete(machine._id)} color="error">
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
