import './MachineCard.css';

export default function MachineCard(props: { key: number; machine: MachineCardType }) {
  const { key, machine } = props;
  const { name, type } = machine;
  return (
    <div id="machine-card" key={key}>
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

export type MachineCardType = {
  id: string;
  user_id: string;
  name: string;
  type: string;
};