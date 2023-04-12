import { useState } from 'react'
import './App.css'

import Navbar from './components/_layout/Navbar'
import HeroSection from './components/_layout/HeroSection';
import Sensors from './components/_layout/Sensors';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex flex-col flex-1'>
      <Navbar />
      
      <HeroSection />

      <Sensors />
    </div>
  )
}

export default App
