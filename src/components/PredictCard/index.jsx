import Desktop from "../../assets/desktop-and-mobile.png";
import LogoPredict from "../../assets/logo-dynapredict.svg";

import "./index.scss";

export default function PredictCard() {
  return (
    <div className="background">
        <div className="divPredict">
          <h1 className="title">Solução <br /> DynaPredict</h1>
          <img src={LogoPredict} alt="Predict" className="logoPredict" />
        </div>
        <div className="desktop">
          <img src={Desktop} alt="Desktop and Mobile" />
      </div>
    </div>
  );
}
