// Componente para renderizar informações gerais de cada máquina
import { Machine } from "../types";
import { deleteMachine } from "../redux/actions/machineActions";
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import Form from './Form';
import { postMonitoringPoint } from "../redux/actions/monitoringActions";

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
  <div key={machine.id} className="machine-card">
  <h2>{machine.name}</h2>
  <p>Type: {machine.type}</p>
  <button onClick={() => handleDelete(machine.id)}>Delete</button>
  <button onClick={() => setShowEditForm(true)}>Edit</button>
  <button type="button" onClick={() => setMonitoringPoint(!monitoringPoint)}>Add Monitoring Point</button>
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
</div>
  )
}