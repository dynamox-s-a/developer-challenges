import { useState } from 'react';

interface MachineFormProps {
  initialData?: { name: string; type: string };
  onSubmit: (data: { name: string; type: string }) => void;
}

const MachineForm = ({ initialData, onSubmit }: MachineFormProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.type || 'Pump');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, type });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Pump">Pump</option>
        <option value="Fan">Fan</option>
      </select>
      <button type="submit">Save</button>
    </form>
  );
};

export default MachineForm;
