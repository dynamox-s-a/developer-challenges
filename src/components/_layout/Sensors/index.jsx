import React from 'react'

import { title } from '../../../data/sensors';

import SectionTitle from '../../SectionTitle';

const index = () => {
  return (
    <section className='flex px-24 pt-24 pb-12 bg-blue-light text-center'>
        
        <SectionTitle title={title} />

    </section>
  )
}

export default index