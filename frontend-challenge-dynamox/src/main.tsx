import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App }  from './app.tsx'
import { Provider } from 'react-redux';
import { store } from './features/store.ts'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>  
  </StrictMode>,
)
