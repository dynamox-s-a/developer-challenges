import './App.css'
import { Provider } from 'react-redux'
import { RoutesConfig } from './routes'
import { BrowserRouter } from "react-router"
import { store } from './redux/store'

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <RoutesConfig />
      </BrowserRouter>
    </Provider>
  )
}

export default App
