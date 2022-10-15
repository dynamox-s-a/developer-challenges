import logo from "./logo.svg";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Navbar } from "./componentes/Navbar";
import { Banner } from "./componentes/Banner";
import { Sensores } from "./componentes/Sensores";
import { Footer } from "./componentes/Footer";
import { Sidebar } from "./componentes/Sidebar";
import { useState } from "react";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <BrowserRouter>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} />
      <Banner />
      <Sensores />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
