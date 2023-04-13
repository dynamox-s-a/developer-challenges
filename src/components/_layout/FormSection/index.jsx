import React from 'react'

import { title, formFields } from '../../../data/form';

import Title from './Title';
import Form from './Form';

const index = () => {
  return (
    <footer className='flex flex-col items-center justify-center gap-8 bg-blue-primary py-10 px-24 text-white'>
        
        <Title title={title} />

        <Form formFields={formFields} />

    </footer>
  )
}

export default index