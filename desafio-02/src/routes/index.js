import React from "react";
import { Routes as Switch, Route } from 'react-router-dom';
import AllProducts from "../pages/AllProducts";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NewProduct from "../pages/NewProduct";

function Routes() {
  return (
    <Switch>
      <Route exact path="/" element={ <Login /> } />
      <Route exact path="/home" element={ <Home /> } />
      <Route exact path="/all" element={ <AllProducts /> } />
      <Route exact path="/new" element={ <NewProduct /> } />

    </Switch>
  );
}

export default Routes;