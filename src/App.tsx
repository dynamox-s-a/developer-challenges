import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import BtnShowData from "./components/Button/Button";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<BtnShowData />} />
      <Route path="/data" element={<Home />} />
    </Routes>
  </Router>
);

export default App;
