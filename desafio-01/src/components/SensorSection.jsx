import React from 'react';
import sensorAS from '../images/sensor-tca.png';
import sensorTCA from '../images/sensor-af.png';
import sensorHF from '../images/sensor-hf.png';

function SensorSection() {
  return (
    <section id='sensors-section' className='font-raleway pt-24 pb-10 bg-bg-light-cyan-blue h-auto w-full'>
      <div className='flex justify-center flex-col items-center'>
        <h2 className=' py-2 font-bold text-title-sensors  text-title-blue leading-10'>Sensores para Manutenção Preditiva</h2>
        <p className='py-3 text-2xl mx-32  text-text-sensors leading-9 font-normal text-center'>
          Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e
          temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway,
          registrando os dados monitorados em sua memória interna. Por conexão internet esses dados
          são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de
          decisão.
        </p>
        <a href="https://dynamox.net/dynapredict/" target="_blank" rel="noreferrer">
          <button 
          className='p-2 w-button-width mt-7 bg-primary-blue text-white font-bold text-xl rounded'
          type="button">VER MAIS</button>
        </a>
      </div>
      <div className='mt-10 flex items-center flex-row justify-evenly text-name-sensors font-bold text-title-sensors'>
        <div className='flex flex-col items-center'>
          <img className='w-72' src={sensorAS} alt="sensor-AS" />
          <h4 className=''>AS</h4>
        </div>
        <div className='flex flex-col items-center'>
          <img className='w-72' src={sensorTCA} alt="sensor-TcA+" />
          <span>TcA+</span>
        </div>
        <div className='flex flex-col items-center'>
          <img className='w-72' src={sensorHF} alt="sensorHF" />
          <span>HF</span>
        </div>
      </div>
    </section>
  );
}

export default SensorSection;
