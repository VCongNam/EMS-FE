import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/styles/global.css'
import App from './App.jsx'
import { NotificationProvider } from './contexts/NotificationContext';
import { PWAProvider } from './contexts/PWAContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PWAProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </PWAProvider>
  </StrictMode>,
);
