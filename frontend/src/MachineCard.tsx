import { Navigate } from 'react-router-dom';
import './MachineCard.css';

export default function MachineCard(props: {
  key: number;
  machine: MachineType;
}) {
  const { key, machine } = props;
  const { name, type } = machine;

  return (
    <div
      id="machine-card"
      key={key}
      onClick={() => {
        console.log('go to sensor');
        return <Navigate to={`/sensors?id=${machine.id}&type=${machine.type}`} />;
      }}
    >
      <div>
        <h3>Machine Name:</h3>
        <p>{name}</p>
      </div>
      <div>
        <h4>Machine Type:</h4>
        <p>{type}</p>
      </div>
      <div></div>
    </div>
  );
}

export type MachineType = {
  id: string;
  userId: string;
  name: string;
  type: string;
};
