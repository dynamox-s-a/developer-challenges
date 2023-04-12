import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-red-500'>
      <h1>react (vite) + tailwind</h1>
    </div>
  )
}

export default App
