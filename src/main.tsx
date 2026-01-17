import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { Provider } from 'react-redux'
import { store } from './store'

// renderizo a aplicação no elemento root do HTML
ReactDOM.createRoot(document.getElementById('root')!).render(
    // envolvo a aplicação com o Provider do Redux para disponibilizar a store em todos os componentes
    <Provider store={store}>
      {/* envolvo com BrowserRouter para habilitar roteamento na aplicação */}
      <BrowserRouter>
        {/* uso CssBaseline para normalizar os estilos padrão do navegador */}
        <CssBaseline />
        {/* renderizo o componente principal da aplicação */}
        <App />
      </BrowserRouter>
    </Provider>,
)