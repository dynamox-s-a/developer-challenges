import React from 'react';
import sensorAS from '../images/sensor-tca.png';
import sensorTCA from '../images/sensor-af.png';
import sensorHF from '../images/sensor-hf.png';

function SensorSection() {
  return (
    <section id='sensors-section'>
      <div>
        <h2>Sensores para Manutenção Preditiva</h2>
        <p>
          Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e
          temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway,
          registrando os dados monitorados em sua memória interna. Por conexão internet esses dados
          são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de
          decisão.
        </p>
        <a href="https://dynamox.net/dynapredict/" target="_blank" rel="noreferrer">
          <button type="button">VER MAIS</button>
        </a>
      </div>
      <div>
        <img src={sensorAS} alt="sensor-AS" />
        <h4>AS</h4>
        <img src={sensorTCA} alt="sensor-TcA+" />
        <span>TcA+</span>
        <img src={sensorHF} alt="sensorHF" />
        <span>HF</span>
      </div>
    </section>
  );
}

export default SensorSection;
