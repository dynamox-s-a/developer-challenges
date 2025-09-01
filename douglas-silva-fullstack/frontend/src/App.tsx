import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import theme from "./theme/theme";
import Layout from "@components/layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Machines from "./pages/Machines/Machines";
import MachineForm from "./pages/Machines/MachineForm";
import MachineDetails from "./pages/Machines/MachineDetails";
import AssetsTree from "./pages/Tree/AssetsTree";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/machines" element={<Machines />} />
            <Route path="/machines/new" element={<MachineForm />} />
            <Route path="/machines/:id" element={<MachineDetails />} />
            <Route path="/machines/:id/edit" element={<MachineForm />} />
            <Route path="/tree" element={<AssetsTree />} />
            <Route path="*" element={<div>Página não encontrada</div>} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
