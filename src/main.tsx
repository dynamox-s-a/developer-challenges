import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/latin-500.css';
import '@fontsource/roboto/latin-700.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
