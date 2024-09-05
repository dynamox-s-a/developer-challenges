import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Importe o Provider do react-redux
import { store } from './store/store'; // Importe a store configurada
import { HelmetProvider } from 'react-helmet-async'; // Importe o HelmetProvider
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider> {/* Adicione o HelmetProvider aqui */}
        <App />
      </HelmetProvider>
    </Provider>
  </StrictMode>,
);
