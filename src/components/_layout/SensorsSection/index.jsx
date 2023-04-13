import React from 'react'

import { title, button, description, sensors } from '../../../data/sensors';

import SectionTitle from '../../SectionTitle';
import SectionDescription from '../../SectionDescription';
import Button from './Button';
import SensorsList from './SensorsList';

const index = () => {
  return (
    <section id="sensors" className='flex flex-col items-center justify-center gap-8 px-6 pt-24 pb-12 bg-blue-light text-center
      lg:px-24'
    >
        
        <SectionTitle title={title} />

        <SectionDescription description={description} />

        <Button title={button.title} link={button.link} />

        <SensorsList sensors={sensors} />

    </section>
  )
}

export default index