import { useNavigate } from 'react-router-dom';
import CreateSensor from './CreateSensor';
import UserCard from './components/UserCard';

export default function Sensors() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Sensors</h2>
      <button type="button" onClick={() => navigate('/machines')}>
        Back to Machines
      </button>
      <p></p>
      <CreateSensor />
      <UserCard />
    </div>
  );
}

export type SensorType = {
  id: string;
  name: string;
  type: string;
  machineId: string;
};
