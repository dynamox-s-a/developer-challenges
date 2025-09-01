import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MachinesList from "./pages/MachinesList";
import CreateMachine from "./pages/CreateMachine";
import MachineDetails from "./pages/MachineDetails";


function App() {
  return (
    <Router>
      <div style={{ padding: 16 }}>
        <h1>Dynapredict Machines</h1>
        <nav style={{ marginBottom: 12 }}>
          <Link to="/machines">Listar</Link> | <Link to="/machines/new">Cadastrar</Link>
        </nav>

        <Routes>
          <Route path="/machines" element={<MachinesList />} />
          <Route path="/machines/new" element={<CreateMachine />} />
          <Route path="/machines/:id" element={<MachineDetails />} />
          <Route path="*" element={<MachinesList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;