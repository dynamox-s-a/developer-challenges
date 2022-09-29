import React from "react";
import LogoDynapredict from "../assets/logo-dynapredict.png";
import DesktopAndMobile from "../assets/desktop-and-mobile.png";

export default function DynaPredict() {
  return (
    <section>
      <div>
        <h1>Solução DynaPredict</h1>
        <img src={LogoDynapredict} alt="logo-dynapredict.png" />
      </div>
      <div>
        <img src={DesktopAndMobile} alt="desktop-and-mobile.png" />
      </div>
    </section>
  );
}
