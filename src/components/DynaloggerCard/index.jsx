import Tcaplus from "../../assets/sensor-tca.png";
import As from "../../assets/sensor-af.png";
import Hf from "../../assets/sensor-hf.png";

import "./index.scss";

const Title = "Sensores para Manutenção Preditiva";
const DynaloggerTxt =
  "Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway, registrando os dados monitorados em sua memória interna. Por conexão internet esses dados são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão.";

const teste =
  "flex flex-col w-72 items-center text-[#5D7A8C] text-[2.5rem] leading-[2.935rem] font-bold";

export default function SensorsCard() {
  return (
    <div className="main" id="sensors">
      <div className="text">
        <span className="titleSensor">{Title}</span>
        <span className="txtSensor">{DynaloggerTxt}</span>
        <a href="https://dynamox.net/dynapredict/" target="_blank">
          <button className="button">VER MAIS</button>
        </a>
      </div>
      <div className="containerImg">
        <div className="images">
          <img src={Tcaplus} />
          <span>TcA+</span>
        </div>
        <div className="images">
          <img src={As} />
          <span>AS</span>
        </div>
        <div className="images">
          <img src={Hf} />
          <span>HF</span>
        </div>
      </div>
    </div>
  );
}
