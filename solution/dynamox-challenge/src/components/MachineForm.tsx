import React, { useState } from 'react';

export default function MachineForm() {
  const [machineName, setMachineName] = useState('');
  const [machineType, setMachineType] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!machineName || !machineType ) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    console.log({
      machineName,
      machineType
    });

    setMachineName('');
    setMachineType('');
    setError('');
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