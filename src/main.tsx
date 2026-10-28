import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './print.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for PWA & Offline Support
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New app version available.');
  },
  onOfflineReady() {
    console.log('Netra Mobile Center is ready to work offline.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
