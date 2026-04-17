import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { validateRuntimeEnv } from '@/config/runtimeEnv';

function renderFatal(message: string) {
  const root = document.getElementById('root');
  if (!root) return;

  root.innerHTML = `
    <main style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#f9fafb;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
      <section style="max-width:760px;width:100%;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:24px;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
        <h1 style="margin:0 0 8px;font-size:24px;color:#111827;">Unable to load application</h1>
        <p style="margin:0 0 12px;color:#4b5563;line-height:1.5;">A runtime error occurred during startup. Please refresh the page. If this persists, share the error below with support.</p>
        <pre style="white-space:pre-wrap;word-break:break-word;margin:0;padding:12px;background:#111827;color:#f9fafb;border-radius:10px;font-size:13px;line-height:1.4;">${message}</pre>
      </section>
    </main>
  `;
}

window.addEventListener('error', (event) => {
  renderFatal(event.error?.message || event.message || 'Unknown runtime error');
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const message = reason instanceof Error ? reason.message : String(reason);
  renderFatal(message || 'Unhandled promise rejection');
});

try {
  validateRuntimeEnv();

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  renderFatal(message || 'Unknown startup error');
}
