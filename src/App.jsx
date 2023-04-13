import { useState } from 'react'
import './App.css'

import Navbar from './components/_layout/Navbar'
import HeroSection from './components/_layout/HeroSection';
import SensorsSection from './components/_layout/SensorsSection';
import FormSection from './components/_layout/FormSection';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex flex-col flex-1'>
      <Navbar />
      
      <HeroSection />

      <SensorsSection />

      <FormSection />
    </div>
  )
}

export default App
