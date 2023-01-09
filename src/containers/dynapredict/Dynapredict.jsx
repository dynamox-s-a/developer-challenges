import React from 'react';
import './dynapredict.css';
import { Sensor } from '../../components';

const Dynapredict = () => {
  return (
    <div className="dynapredict" id="Sensores">
      <h2>Sensores para Manutenção Preditiva</h2>
      <div className="dynapredict-heading">
        <p>Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e<br></br>
temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway,<br></br>
registrando os dados monitorados em sua memória interna. Por conexão internet esses dados<br></br>
são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão.</p>
      </div>
      <div className="dynapredict-btn">
        <a href="https://dynamox.net/dynapredict/"><p>VER MAIS</p></a>
      </div>
      <div>
        <Sensor />
        </div>
      </div>
  )
}

export default Dynapredict