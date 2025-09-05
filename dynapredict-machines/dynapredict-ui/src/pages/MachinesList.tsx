import { Link } from "react-router-dom";

function MachinesList() {
  // lista fake só para testar navegação
  const machines = [
    { id: 1, name: "Torno Mecânico", serial: "ABC123" },
    { id: 2, name: "Prensa Hidráulica", serial: "XYZ456" },
  ];

  return (
    <div>
      <h2>Lista de Máquinas</h2>
      <ul>
        {machines.map((m) => (
          <li key={m.id}>
            {m.name} ({m.serial}){" "}
            <Link to={`/machines/${m.id}`}>Ver Detalhes</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MachinesList;
