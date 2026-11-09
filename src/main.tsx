import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/app/App';
import { ErrorBoundary } from '@/app/ErrorBoundary';
import { ServicesProvider } from '@/app/ServicesProvider';
import { ToastProvider } from '@/app/ToastProvider';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');
createRoot(container).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ServicesProvider>
        <ToastProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastProvider>
      </ServicesProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
