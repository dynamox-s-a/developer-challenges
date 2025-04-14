// Componente para renderizar informações gerais de cada máquina
import { Machine } from "../types";
import { deleteMachine } from "../redux/actions/machineActions";
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import Form from './Form';
import { postMonitoringPoint } from "../redux/actions/monitoringActions";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Card, CardContent, Typography } from "@mui/material";

type MachineCardProps = {
  machine: Machine;
}

export default function MachineCard({machine}: MachineCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [showEditForm, setShowEditForm] = useState(false);
  const [monitoringPoint, setMonitoringPoint] = useState(false);
  const [monitoringName, setMonitoringName] = useState('');
  const [error, setError] = useState('');  
  const handleCancelEditMachine = () => {
    setShowEditForm(false);
  };

  const handleDelete = (machineId: string | undefined) => {
      if (machineId !== undefined) {
        dispatch(deleteMachine(machineId));
      }
  };

  const handleSubmitMonitoring = (e: React.FormEvent) => {
      e.preventDefault();
      if (!monitoringName) {
        setError('All fields are required.');
        return error;
      }
      dispatch(postMonitoringPoint(machine.id!, {name: monitoringName}));
      setMonitoringPoint(false);
  }

  return (
  <Card sx={{ maxWidth: 365 }} key={machine.id} className="machine-card">
  <CardContent>
  <Typography gutterBottom variant="h5" component="div">
          { machine.name}
  </Typography>
  <Typography gutterBottom variant="body2" component="div">Type: {machine.type}</Typography>
  <Button
  variant="text"
  onClick={() => handleDelete(machine.id)}
  color="error"
  >
    <DeleteIcon />
  </Button>
  <Button
  onClick={() => setShowEditForm(true)}>
    <EditIcon />
    </Button>
  <Button
  type="button"
  onClick={() => setMonitoringPoint(!monitoringPoint)}
  variant="text"
  >Add Monitoring Point
  </Button>
  </CardContent>
  { monitoringPoint && (
    <div>
      <input
                type="text"
                placeholder="Monitoring Point Name"
                value={ monitoringName }
                onChange={ (e) => setMonitoringName(e.target.value) }
              />
              <button type="button" onClick={ handleSubmitMonitoring }>Add</button>
              <button type="button" onClick={ () => setMonitoringPoint(false) }>Cancel</button>
    </div>
  )}
  { showEditForm && (
    <>
              <Form
                isEdit={true}
                machineId={machine.id}
                onFinish={handleCancelEditMachine}
                />
              <button onClick={handleCancelEditMachine}>Cancel</button>
            </>
  )}
</Card>
  )
}