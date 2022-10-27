import React from "react";
import Form from "./components/Form";
import NavigationMenu from "./components/NavigationMenu";
import PredictCard from "./components/PredictCard";
import SensorsCard from "./components/DynaloggerCard";

import "./App.css";

function App() {
  return (
    <div>
      <NavigationMenu />
      <PredictCard />
      <SensorsCard />
      <Form />
    </div>
  );
}

export default App;
