import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import NavigationRoutes from "./routes";
import "./styles/index.css";

export default function App() {
  return (
    <Router>
      <NavigationRoutes />
    </Router>
  );
}
