import React from "react";
import { Routes as Switch, Route } from 'react-router-dom';
import AllProducts from "../pages/AllProducts";
import Home from "../pages/Home";

function Routes() {
  return (
    <Switch>
      <Route exact path="/" element={ <Home /> } />
      <Route exact path="/all" element={ <AllProducts /> } />

    </Switch>
  );
}

export default Routes;