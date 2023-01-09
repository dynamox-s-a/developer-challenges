import React from "react";
import Header from "../components/header";
import DynapredicSolution from "../components/dynapredicSolution";
import Sensors from "../components/sensors";
import Contact from "../components/contact";

export default function HomePage(): JSX.Element {
  return (
    <>
      <Header />
      <DynapredicSolution />
      <Sensors />
      <Contact />
    </>
  );
}
