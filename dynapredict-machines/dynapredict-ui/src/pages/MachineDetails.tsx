import { useParams } from "react-router-dom";

function MachineDetails() {
  const { id } = useParams();

  return (
    <div>
      <h2>Detalhes da Máquina</h2>
      <p>ID da máquina: {id}</p>
      <p>(Aqui vamos buscar os detalhes da API futuramente)</p>
    </div>
  );
}

export default MachineDetails;
