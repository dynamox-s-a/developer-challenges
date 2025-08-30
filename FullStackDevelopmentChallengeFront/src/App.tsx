import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import CreateMachine from "./pages/CreateMachine/CreateMachine";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<CreateMachine />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
