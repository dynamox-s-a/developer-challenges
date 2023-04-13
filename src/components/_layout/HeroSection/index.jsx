import React from 'react'

import { title, logo, image } from '../../../data/hero';

import Title from './Title';
import Image from './Image';

const index = () => {
  return (
    <section className="flex flex-row h-[100vh] w-full bg-hero bg-cover bg-no-repeat z-10">
        <Title title={title} logo={logo} />

        <Image image={image} />
    </section>
  )
}

export default index