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
        setError('Todos os campos são obrigatórios.');
        return;
      }
      dispatch(postMonitoringPoint(machine.id!, {name: monitoringName}));
      setMonitoringPoint(false);
  }

  return (
  <div key={machine.id} className="machine-card">
  <h2>{machine.name}</h2>
  <p>Tipo: {machine.type}</p>
  <button onClick={() => handleDelete(machine.id)}>Excluir Máquina</button>
  <button onClick={() => setShowEditForm(true)}>Editar</button>
  <button type="button" onClick={() => setMonitoringPoint(!monitoringPoint)}>Adicionar Monitoramento</button>
  { monitoringPoint && (
    <div>
      <input
                type="text"
                placeholder="Nome do Ponto de Monitoramento"
                value={ monitoringName }
                onChange={ (e) => setMonitoringName(e.target.value) }
              />
              <button type="button" onClick={ handleSubmitMonitoring }>Adicionar</button>
              <button type="button" onClick={ () => setMonitoringPoint(false) }>Cancelar</button>
    </div>
  )}
  { showEditForm && (
    <>
              <Form
                isEdit={true}
                machineId={machine.id}
                onFinish={handleCancelEditMachine}
                />
              <button onClick={handleCancelEditMachine}>Cancelar</button>
            </>
  )}
</div>
  )
}