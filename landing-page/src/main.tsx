
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.module.scss';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
