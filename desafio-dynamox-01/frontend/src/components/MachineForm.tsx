import React, { useState } from 'react';
import api from '../../../api/api';

interface MachineFormProps {
  onSave: () => void;
  machine?: { id: number; name: string; type: string };
}

const MachineForm: React.FC<MachineFormProps> = ({ onSave, machine }) => {
  const [name, setName] = useState(machine?.name || '');
  const [type, setType] = useState(machine?.type || 'Bomba');

  const handleSubmit = async () => {
    if (machine) {
      await api.put(`/machines/${machine.id}`, { name, type });
    } else {
      await api.post('/machines', { name, type });
    }
    onSave();
  };

  return (
    <div>
      <h2>{machine ? 'Editar Máquina' : 'Criar Máquina'}</h2>
      <input
        type="text"
        placeholder="Nome da Máquina"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Bomba">Bomba</option>
        <option value="Ventilador">Ventilador</option>
      </select>
      <button onClick={handleSubmit}>
        {machine ? 'Salvar Alterações' : 'Criar'}
      </button>
    </div>
  );
};

export default MachineForm;
