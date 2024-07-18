import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

const App = () => (
  <Router>
    <Routes>
      <Route path="/data" element={<Home />} />
    </Routes>
  </Router>
);

export default App;
