import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { postMachine } from '../redux/actions';
import { AppDispatch, RootState } from '../redux/store';

export default function MachineForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [machineName, setMachineName] = useState('');
  const [machineType, setMachineType] = useState('');
  const [error, setError] = useState('');
  const userId = useSelector((state: RootState) => state.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!machineName || !machineType ) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    if (machineType === "Pump" || machineType === "Fan") {
    const newMachine = {
      name: machineName,
      type: machineType,
      userId: Number(userId),
    };
    dispatch(postMachine(newMachine));
    }


    setMachineName('');
    setMachineType('');
    setError('');
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome da Máquina"
        value={machineName}
        onChange={(e) => setMachineName(e.target.value)}
      />
      <select
        value={machineType}
        onChange={(e) => setMachineType(e.target.value)}
      >
        <option value="">Selecione o Tipo</option>
        <option value="Pump">Pump</option>
        <option value="Fan">Fan</option>
      </select>
      <button type="submit">Adicionar Máquina</button>
      {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
    </form>
  );
}