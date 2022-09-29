import React from "react";
import SensorAf from "../assets/sensor-af.png";
import SensorHf from "../assets/sensor-hf.png";
import SensorTca from "../assets/sensor-tca.png";

export default function Sensores() {
  return (
    <section>
      <h3>Sensores para Manutenção Preditiva</h3>
      <p>
        Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e temperatura
        embarcados, que comunicam por Bluetooth com o App mobile ou Gateway, registrando os dados
        monitorados em sua memória interna. Por conexão internet esses dados são centralizados na
        Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão.
      </p>
      <button type="button">VER MAIS</button>
      <div>
        <div>
          <img src={SensorTca} alt="sensor-tca.png" />
          <h2>TcA+</h2>
        </div>
        <div>
          <img src={SensorAf} alt="sensor-af.png" />
          <h2>AS</h2>
        </div>
        <div>
          <img src={SensorHf} alt="sensor-hf.png" />
          <h2>HF</h2>
        </div>
      </div>
    </section>
  );
}
