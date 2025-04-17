import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { deleteMachine, Machine } from '../../redux/machinesSlice';

interface MachineTableProps {
  machines: Machine[];
  onEdit: (id: string) => void;
}

export const MachineTable: React.FC<MachineTableProps> = ({ machines, onEdit }) => {
  const dispatch = useDispatch();

  const handleDelete = (id: string) => {
    dispatch(deleteMachine(id));
  };

  return (
    <Table sx={{ maxWidth: 600 }}>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {machines.map((machine) => (
          <TableRow key={machine.id}>
            <TableCell>{machine.name}</TableCell>
            <TableCell>{machine.type}</TableCell>
            <TableCell align="right">
              <IconButton onClick={() => onEdit(machine.id)} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(machine.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
