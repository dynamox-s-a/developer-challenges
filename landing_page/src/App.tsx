import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";

function App(): JSX.Element {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
