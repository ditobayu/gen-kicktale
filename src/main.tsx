import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/app.css';
const root=ReactDOM.createRoot(document.getElementById('root')!);
if(import.meta.env.DEV&&location.pathname==='/dev/animations'){void import('./components/AnimationGallery').then(({default:Gallery})=>root.render(<React.StrictMode><Gallery/></React.StrictMode>));}
else root.render(<React.StrictMode><App/></React.StrictMode>);
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => { void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => { /* Offline enhancement is optional on restricted hosts. */ }); });
}
