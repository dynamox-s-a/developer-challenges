import {
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../../app/store';
import { deleteMachine, type Machine } from './MachinesSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  onSelect: (machine: Machine) => void;
}

export default function MachineList({ onSelect }: Props) {
    const machines = useSelector((state: RootState) => state.machines.list);
    const dispatch = useDispatch();

    const handleDelete = (id: string) => {
        dispatch(deleteMachine(id));
    };

    return (
        <Box>
        <Typography variant="h6" gutterBottom>
          Registered machines
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
  
          <TableBody>
            {machines.map((machine: Machine) => (
              <TableRow key={machine.id}>
                <TableCell>{machine.name}</TableCell>
                <TableCell>{machine.type}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onSelect(machine)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(machine.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    );
}        
 
