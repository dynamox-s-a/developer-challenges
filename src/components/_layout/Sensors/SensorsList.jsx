import React from 'react'

const SensorsList = ({ sensors }) => {
  return (
    <div className='flex flex-row w-full items-center justify-evenly'>
    {
        sensors.map(sensor => <Sensor key={sensor.name} name={sensor.name} image={sensor.image} />)
    }
    </div>
  )
}

const Sensor = ({ name, image }) => {    

    return(
        <div className='flex flex-col'>
            <img src={image} alt={name} className='w-72' />
            
            <h1 className='text-[#5D7A8C] font-bold text-[2.5rem] leading-[2.935rem] mt-4'>
                {name}
            </h1>
        </div>
    )
}

export default SensorsList