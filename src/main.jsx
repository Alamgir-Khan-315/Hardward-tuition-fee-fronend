import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AppProvider } from './context.jsx';
import './index.css';

// iPhone Safari viewport "user-scalable=no" ko ignore karta hai, is liye pinch-zoom yahan band hai.
['gesturestart', 'gesturechange', 'gestureend'].forEach((t) =>
  document.addEventListener(t, (e) => e.preventDefault(), { passive: false })
);
document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
        <Toaster
          position="top-center"
          containerStyle={{ top: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
          toastOptions={{
            duration: 2600,
            style: { borderRadius: '14px', fontSize: '14px', maxWidth: '92vw', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)', boxShadow: '0 10px 30px rgba(15,23,42,.18)' },
          }}
        />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
