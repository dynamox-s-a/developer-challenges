import React from 'react';
import './sensor.css';
import TcA from '../../assets-desafio-01/sensor-tca.png';
import AS from '../../assets-desafio-01/sensor-af.png';
import HF from '../../assets-desafio-01/sensor-hf.png';

const Sensor = () => {
  return (
    <div className="dynapredict-sensores">
      <div className="sensor-tca">
        <img src={TcA} alt="sensor-TcA" />
        <p>TcA+</p>
      </div>
      <div className="sensor-as">
        <img src={AS} alt="sensor-AS" />
        <p>AS</p>
      </div>
      <div className="sensor-hf">
        <img src={HF} alt="sensor-HF" />
        <p>HF</p>
      </div>
    </div>
  )
}

export default Sensor