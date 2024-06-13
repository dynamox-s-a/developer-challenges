import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import './MachineCard.css';

export default function MachineCard(props: { machine: MachineType }) {
  const { machine } = props;
  const { name, type } = machine;

  const [r, setR] = useState(false);
  const redirect = () => setR(true);
  if (r)
    return <Navigate to={`/sensors?id=${machine.id}&type=${machine.type}`} />;

  return (
    <div id="machine-card" onClick={() => redirect()}>
      <div>
        <h3>Machine Name:</h3>
        <p>{name}</p>
      </div>
      <div>
        <h4>Machine Type:</h4>
        <p>{type}</p>
      </div>
    </div>
  );
}

export type MachineType = {
  id: string;
  userId: string;
  name: string;
  type: string;
};
