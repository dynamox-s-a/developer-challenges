import './App.css'
import { RoutesConfig } from './routes'
import { BrowserRouter } from "react-router"

function App() {

  return (
    <BrowserRouter>
      <RoutesConfig />
    </BrowserRouter>
  )
}

export default App
