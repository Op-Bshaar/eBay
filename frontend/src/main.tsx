import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { loadConfig } from './helpers/config.ts';

const renderApp = async () => {
    await loadConfig();
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App />
        </StrictMode>,
    )
};

renderApp();

