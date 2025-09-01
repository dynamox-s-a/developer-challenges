import { Routes, Route, Link } from "react-router-dom";
import MachinesList from "./pages/MachinesList";
import MachineCreate from "./pages/MachineCreate";
import MachineDetails from "./pages/MachineDetails";

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dynapredict Machines</h1>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/">Listar Máquinas</Link> |{" "}
        <Link to="/create">Cadastrar Máquina</Link>
      </nav>

      <Routes>
        <Route path="/" element={<MachinesList />} />
        <Route path="/create" element={<MachineCreate />} />
        <Route path="/machines/:id" element={<MachineDetails />} />
      </Routes>
    </div>
  );
}

export default App;
