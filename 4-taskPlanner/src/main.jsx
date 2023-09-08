import React from 'react'
import ReactDOM from 'react-dom/client'

import './assets/styles/index.css';
import App from './components/App/App';
import Layout from './components/Layout/Layout';


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

function sendNotification(message) {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification('Новая задача', {
        body: message,
      });
    });
  }
}

function requestNotificationPermission(callback) {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      callback();
    }
  });
}

requestNotificationPermission(() => sendNotification('Hello from notification'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Layout>
      <App />
    </Layout>
  </React.StrictMode>,
)
