import React from 'react'

import Title from './Title';
import Image from './Image';

const index = () => {
  return (
    <section className="flex flex-row h-[100vh] bg-hero bg-contain bg-no-repeat">
        <Title />

        <Image />
    </section>
  )
}

export default index