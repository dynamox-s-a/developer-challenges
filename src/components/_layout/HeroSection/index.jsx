import React from 'react'

import { title, logo, image } from '../../../data/hero';

import Title from './Title';
import Image from './Image';

const index = () => {
  return (
    <section className="flex flex-col h-[100vh] w-full bg-hero bg-cover bg-no-repeat z-10
      lg:flex-row lg:mt-[7.5rem]"
    >
        <Title title={title} logo={logo} />

        <Image image={image} />
    </section>
  )
}

export default index