import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'
import AuthenticationProvider from './context/AuthenticationProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthenticationProvider>
      <App />
    </AuthenticationProvider>
  </StrictMode>
);
