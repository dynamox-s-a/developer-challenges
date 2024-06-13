import UserCard from './UserCard';
import CreateMachine from './CreateMachine';
import ListMachines from './ListMachines';
import './Machines.css';

export default function Machines() {
  return (
    <div id='machinesBox'>
      <h1>Machines</h1>
      <div id="content">
        <CreateMachine />
        <ListMachines />
      </div>
      <UserCard />
    </div>
  );
}