import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import NavigationRoutes from "./routes";
import { GlobalStyle } from "./styles/pages/MainPage";

export default function App() {
  return (
    <Router>
      <GlobalStyle />
      <NavigationRoutes />
    </Router>
  );
}
