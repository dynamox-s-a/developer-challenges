import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function MachineForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [machineName, setMachineName] = useState('');
  const [machineType, setMachineType] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!machineName || !machineType ) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    dispatch({type: "POST_MACHINE", payload: { name: machineName, type: machineType }});

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