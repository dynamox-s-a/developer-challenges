import { useState } from "react";

function MachineCreate() {
  const [name, setName] = useState("");
  const [serial, setSerial] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Máquina cadastrada: ${name} - ${serial}`);
  };

  return (
    <div>
      <h2>Cadastrar Máquina</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Serial:</label>
          <input
            type="text"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            required
          />
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default MachineCreate;
