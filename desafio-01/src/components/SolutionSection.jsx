import React from 'react';
import logoDynaPredict from '../images/logo-dynapredict.png';
import bgImage from '../images/grafismo.png';
import desktopAndMobile from '../images/desktop-and-mobile.png';

function SolutionSection() {
  return (
    <section className='flex bg-cover bg-no-repeat bg-top justify-center h-screen' style={ { backgroundImage: `url(${bgImage})`}}>
      <div className='md:flex md:shrink-0'>
      <div className='flex flex-col justify-center ml-10 mr-20 text-white font-raleway font-bold 2xl:text-8xl lg:text-6xl sm:text-4xl '>
        <h1 className='mb-3'>Solução</h1>
        <hi className='mb-14'>DynaPredict</hi>
        <img className='w-44 h-8' src={logoDynaPredict} alt="Logo-DynaPredict" />
      </div>
      <div className=''>
        <img className='xl:h-laptop-image xl:w-laptop-image lg:h-4/5 lg:w-full md:h-4/5 md:w-4/5 'src={desktopAndMobile} alt="Desktop and mobile" />
      </div>
      </div>
    </section>
  );
}

export default SolutionSection;
