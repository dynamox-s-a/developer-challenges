import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Header from "./components/Header/Header.js";
import Solucao from "./components/Solution/Solution.js";
import Sensores from "./components/Sensors/Sensors.js";
import Footer from "./components/Footer/Footer.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Header />
    <Solucao />
    <Sensores />
    <Footer />
  </React.StrictMode>
);