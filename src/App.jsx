import { useState } from 'react'
import './App.css'
import Navbar from './components/_layout/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex flex-1'>
      <Navbar />
      
    </div>
  )
}

export default App
