import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postMachine, updateMachine } from '../redux/actions/machineActions';
import { AppDispatch, RootState } from '../redux/store';
// import { postMonitoringPoint } from '../redux/actions/monitoringActions';

type FormProps = {
  isEdit: boolean;
  machineId?: string | null;
  onFinish?: () => void;
}

export default function Form(
  {isEdit, machineId, onFinish}: FormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState('');
  const [select, setSelect] = useState('');
  const [error, setError] = useState('');
  const userId = useSelector((state: RootState) => state.id);
  const machines = useSelector((state: RootState) => state.machines);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !select ) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    if(isEdit) {
      if (machines) {
        const machine = machines.find((machine) => machine.id === machineId);
        if (machine) {
          const updatedMachine = {
            ...machine,
            name: name,
            type: select,
          };
          dispatch(updateMachine(updatedMachine));
          onFinish?.()
        }
      }
    } else if (!isEdit) {
      if (select === "Pump" || select === "Fan") {
        const newMachine = {
          name: name,
          type: select,
          userId: Number(userId),
        };
        dispatch(postMachine(newMachine));
        onFinish?.();
      }
    }

    setName('');
    setSelect('');
    setError('');
  };

  useEffect(() => {
    if (isEdit) {
      if (machines) {
        const machine = machines.find((machine) => machine.id === machineId);
        if (machine) {
          setName(machine.name);
          setSelect(machine.type);
        }
      }
    }
  }, [isEdit, machines, machineId]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={"Nome da Máquina"}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        value={select}
        onChange={(e) => setSelect(e.target.value)}
      >
        <option value="">Selecione o Tipo</option>
        <option value="Pump">Pump</option>
        <option value="Fan">Fan</option>
      </select>
      <button type="submit">{ isEdit? 'Edit' : 'Add Machine'}</button>
      {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
    </form>
  );
}