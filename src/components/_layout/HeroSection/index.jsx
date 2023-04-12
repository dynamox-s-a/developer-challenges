import React from 'react'

import Title from './Title';
import Image from './Image';

const index = () => {
  return (
    <section className="flex flex-row h-[100vh] w-full bg-hero bg-cover bg-no-repeat">
        <Title />

        <Image />
    </section>
  )
}

export default index