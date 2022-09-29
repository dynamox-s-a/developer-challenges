import React from "react";
import Contact from "../components/Contact";
import DynaPredict from "../components/DynaPredict";
import Header from "../components/Header";
import Sensores from "../components/Sensores";
import { MainContainer } from "../styles/pages/MainPage";

export default function MainPage() {
  return (
    <MainContainer>
      <Header />
      <DynaPredict />
      <Sensores />
      <Contact />
    </MainContainer>
  );
}
