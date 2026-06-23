import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import App from './App';
import './styles/global.css';

async function initNativeShell() {
  if (!Capacitor.isNativePlatform()) return;

  document.documentElement.classList.add('native-app');

  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#0f0c29' });
  } catch {
    /* 部分平台不支持 */
  }

  try {
    await SplashScreen.hide();
  } catch {
    /* ignore */
  }
}

initNativeShell();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
