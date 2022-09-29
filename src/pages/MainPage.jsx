import React from "react";
import DynaPredict from "../components/DynaPredict";
import Header from "../components/Header";
import { MainContainer } from "../styles/pages/MainPage";

export default function MainPage() {
  return (
    <MainContainer>
      <Header />
      <DynaPredict />
    </MainContainer>
  );
}
