import React from 'react'

import { title, formFields } from '../../../data/form';

import Title from './Title';
import Form from './Form';

const index = () => {
  return (
    <footer id="contact" className='flex flex-col w-full items-center justify-center gap-8 bg-blue-primary py-10 px-6 text-white
      lg:px-24'
    >
        
        <Title title={title} />

        <Form formFields={formFields} />

    </footer>
  )
}

export default index